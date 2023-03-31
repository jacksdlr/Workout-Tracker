const router = require("express").Router()
const ObjectId = require("mongoose").Types.ObjectId

const { User, Workout, Exercise, Set } = require("../models/models")

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.render("index")
}

router.get("/", (req, res) => {
    res.redirect("/")
})

router.post("/", checkAuthenticated, async (req, res) => {
    // Get user's MongoDB _id from passport
    const { id } = req.user
    // Get form inputs
    let variables = {}

    for (const key in req.body) {
        let value = req.body[key]
        if (value == "" || null) {
            variables[key] = undefined
        } else {
            variables[key] = value
        }
    }

    let {
        date,
        exercise_name,
        exercise_comment,
        set_weight,
        set_weight_unit,
        set_reps,
        set_comment,
        superset_exercise,
        superset_weight,
        superset_weight_unit,
        superset_reps
    } = variables

    // Suffix the weight unit from form if exercise weight has been given
    if (set_weight) {
        set_weight = `${set_weight}${set_weight_unit}`
    }
    if (superset_weight) {
        superset_weight = `${superset_weight}${superset_weight_unit}`
    }

    if (!set_reps) {
        set_reps = "?"
    }

    if (req.body.superset == "on") {
        if (!superset_reps) {
            superset_reps = "?"
        }
    } else {
        superset_exercise = ""
        superset_weight = ""
        superset_reps = ""
    }

    // Define set, exercise, and workout objects for database
    const newSet = new Set({
        set_weight,
        set_reps,
        superset_exercise,
        superset_weight,
        superset_reps,
        comments: set_comment
    })
    const newExercise = new Exercise({
        exercise_name,
        sets: newSet,
        comments: exercise_comment
    })
    const newWorkout = new Workout({
        date,
        exercises: newExercise
    })

    // Find if a workout for the user has already been created
    const existingWorkout = (await User.aggregate([
        { $unwind: "$workouts" },
        { $match: { _id: ObjectId(id), "workouts.date": date } }
    ]))[0]

    if (!existingWorkout) {
        if (newWorkout.exercises[0].sets[0].comments != "") {
            newWorkout.exercises[0].sets[0].comments[0] = `Set 1: ${set_comment}`
        }
        User.findByIdAndUpdate(id, { $push: { workouts: newWorkout } }, { new: true, _id: 0 }, (err, data) => {
            if (err) {
                return res.status(500).json({ message: "An error occurred, please try again later" })
            } else {
                const workout = data.workouts.find(workout => workout.date == req.body.date)
                res.send(workout)
            }
        })
    } else {
        const query = { _id: ObjectId(id), "workouts.date": date }

        // Find if an existing workout already has the exercise added
        const existingExercise = existingWorkout.workouts.exercises.find(exercise => exercise.exercise_name == exercise_name)

        if (!existingExercise) {
            if (newExercise.sets[0].comments != "") {
                newExercise.sets[0].comments[0] = `Set 1: ${set_comment}`
            }
            User.findOneAndUpdate(query, { $push: { "workouts.$.exercises": newExercise } }, { new: true }, (err, data) => {
                if (err) {
                    return res.status(500).json({ message: "An error occurred, please try again later" })
                } else {
                    const workout = data.workouts.find(workout => workout.date == req.body.date)
                    res.send(workout)
                }
            })
        } else {
            const exerciseIndex = existingWorkout.workouts.exercises.findIndex(exercise => exercise.exercise_name == exercise_name)


            // Find if a set has been done with the same weight, reps, etc.
            const existingWeight = existingWorkout.workouts.exercises[exerciseIndex].sets.find(set =>
                set.set_weight == set_weight &&
                set.superset_exercise == superset_exercise &&
                set.superset_weight == superset_weight
            )

            if (!existingWeight) {
                if (set_comment) {
                    newSet.comments[0] = `Set 1: ${set_comment}`
                }
                User.findOneAndUpdate(query, { $push: { [`workouts.$.exercises.${exerciseIndex}.sets`]: newSet, [`workouts.$.exercises.${exerciseIndex}.comments`]: exercise_comment } }, { new: true }, (err, data) => {
                    if (err) {
                        return res.status(500).json({ message: "An error occurred, please try again later" })
                    } else {
                        const workout = data.workouts.find(workout => workout.date == req.body.date)
                        res.send(workout)
                    }
                })
            } else {
                const weightIndex = existingWorkout.workouts.exercises[exerciseIndex].sets.findIndex(set =>
                    set.set_weight == set_weight &&
                    set.superset_exercise == superset_exercise &&
                    set.superset_weight == superset_weight
                )
                if (!set_comment) {
                    User.findOneAndUpdate(query, { $inc: { [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.sets_count`]: 1 }, $push: { [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.set_reps`]: set_reps, [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.superset_reps`]: superset_reps, [`workouts.$.exercises.${exerciseIndex}.comments`]: exercise_comment } }, { new: true }, (err, data) => {
                        if (err) {
                            return res.status(500).json({ message: "An error occurred, please try again later" })
                        } else {
                            const workout = data.workouts.find(workout => workout.date == req.body.date)
                            res.send(workout)
                        }
                    })
                } else {
                    let count = existingWeight.sets_count + 1
                    User.findOneAndUpdate(query, { $inc: { [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.sets_count`]: 1 }, $push: { [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.set_reps`]: set_reps, [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.superset_reps`]: superset_reps, [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.comments`]: `Set ${count}: ${set_comment}`, [`workouts.$.exercises.${exerciseIndex}.comments`]: exercise_comment } }, { new: true }, (err, data) => {
                        if (err) {
                            return res.status(500).json({ message: "An error occurred, please try again later" })
                        } else {
                            const workout = data.workouts.find(workout => workout.date == req.body.date)
                            res.send(workout)
                        }
                    })
                }

            }
        }
    }
})

router.get("/example", (req, res) => {
    Workout.findById("6419d3af67816706c9a419f2", (err, data) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred, please try again later" })
        }
        res.send(data)
    })
})

router.get("/:date", checkAuthenticated, (req, res) => {
    User.findById(req.user._id, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred, please try again later" })
        }
        const workout = data.workouts.find(workout => workout.date == req.params.date)
        res.send(workout)
    })
})

module.exports = router