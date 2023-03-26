const router = require("express").Router()

const {User} = require("../models/models")

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.render("index")
}

router.get("/", (req, res) => {
    res.redirect("/")
})

router.post("/exercise", checkAuthenticated, async (req, res) => {
        const { id } = req.user
        const { exercise_name, date } = req.body

        const user = await User.findById(id)

        const dateIndex = user.workouts.findIndex(workout => workout.date == date)

        if (user.workouts[dateIndex].exercises.length == 1) {
            User.findByIdAndUpdate(id, { $pull: { "workouts": { date } } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        } else {
            User.findByIdAndUpdate(id, { $pull: { [`workouts.${dateIndex}.exercises`]: { exercise_name } } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        }
    })

router.post("/exercise_comments", checkAuthenticated, async (req, res) => {
        const { id } = req.user
        const { exercise_name, date, comment } = req.body

        const user = await User.findById(id)

        const dateIndex = user.workouts.findIndex(workout => workout.date == date)

        const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

        // Deletes all comments matching the one that was selected (who really is going to have multiple of the exact same comment?)
        if (user.workouts[dateIndex].exercises[exerciseIndex].comments.length == 1 && user.workouts[dateIndex].exercises.length == 1 && user.workouts[dateIndex].exercises[exerciseIndex].sets.length == 0) {
            User.findByIdAndUpdate(id, { $pull: { "workouts": { date } } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        } else if (user.workouts[dateIndex].exercises[exerciseIndex].comments.length == 1 && user.workouts[dateIndex].exercises[exerciseIndex].sets.length == 0) {
            User.findByIdAndUpdate(id, { $pull: { [`workouts.${dateIndex}.exercises`]: { exercise_name } } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        } else {
            User.findByIdAndUpdate(id, { $pull: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.comments`]: comment } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        }
    })

router.post("/weight", checkAuthenticated, async (req, res) => {
        const { id } = req.user
        const { exercise_name, date, set_id } = req.body

        const user = await User.findById(id)

        const dateIndex = user.workouts.findIndex(workout => workout.date == date)

        const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

        if (user.workouts[dateIndex].exercises[exerciseIndex].sets.length == 1 && user.workouts[dateIndex].exercises[exerciseIndex].comments.length == 0 && user.workouts[dateIndex].exercises.length == 1) {
            User.findByIdAndUpdate(id, { $pull: { "workouts": { date } } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        } else if (user.workouts[dateIndex].exercises[exerciseIndex].sets.length == 1 && user.workouts[dateIndex].exercises[exerciseIndex].comments.length == 0) {
            User.findByIdAndUpdate(id, { $pull: { [`workouts.${dateIndex}.exercises`]: { exercise_name } } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        } else {
            User.findByIdAndUpdate(id, { $pull: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets`]: { _id: set_id } }, $pull: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.comments`]: { $in: comment } } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        }
    })

router.post("/reps", checkAuthenticated, async (req, res) => {
        const { id } = req.user
        const { exercise_name, date, set_id, repsIndex, newComments } = req.body

        const user = await User.findById(id)

        const dateIndex = user.workouts.findIndex(workout => workout.date == date)

        const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

        const weightIndex = user.workouts[dateIndex].exercises[exerciseIndex].sets.findIndex(set => set._id == set_id)

        if (user.workouts[dateIndex].exercises[exerciseIndex].sets[weightIndex].set_reps.length == 1 && user.workouts[dateIndex].exercises[exerciseIndex].sets.length == 1 && user.workouts[dateIndex].exercises[exerciseIndex].comments.length == 0 && user.workouts[dateIndex].exercises.length == 1) {
            User.findByIdAndUpdate(id, { $pull: { "workouts": { date } } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        } else if (user.workouts[dateIndex].exercises[exerciseIndex].sets[weightIndex].set_reps.length == 1 && user.workouts[dateIndex].exercises[exerciseIndex].sets.length == 1 && user.workouts[dateIndex].exercises[exerciseIndex].comments.length == 0) {
            User.findByIdAndUpdate(id, { $pull: { [`workouts.${dateIndex}.exercises`]: { exercise_name } } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        } else if (user.workouts[dateIndex].exercises[exerciseIndex].sets[weightIndex].set_reps.length == 1) {
            User.findByIdAndUpdate(id, { $pull: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets`]: { _id: set_id } } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        } else {
            await User.findByIdAndUpdate(id, { $unset: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.set_reps.${repsIndex}`]: "", [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.superset_reps.${repsIndex}`]: "" }, $inc: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.sets_count`]: -1 }, $set: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.comments`]: newComments } })

            User.findByIdAndUpdate(id, { $pull: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.set_reps`]: null, [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.superset_reps`]: null } }, { new: true }, (err, data) => {
                const workout = data.workouts.find(workout => workout.date == date)
                res.send(workout)
            })
        }
    })

router.post("/set_comments", checkAuthenticated, async (req, res) => {
        const { id } = req.user
        const { exercise_name, date, set_id, comment } = req.body

        const user = await User.findById(id)

        const dateIndex = user.workouts.findIndex(workout => workout.date == date)

        const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

        const weightIndex = user.workouts[dateIndex].exercises[exerciseIndex].sets.findIndex(set => set._id == set_id)

        User.findByIdAndUpdate(id, { $pull: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.comments`]: comment } }, { new: true }, (err, data) => {
            const workout = data.workouts.find(workout => workout.date == date)
            res.send(workout)
        })
    })

router.post("/superset", checkAuthenticated, async (req, res) => {
        const { id } = req.user
        const { exercise_name, date, set_id } = req.body

        const user = await User.findById(id)

        const dateIndex = user.workouts.findIndex(workout => workout.date == date)

        const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

        const weightIndex = user.workouts[dateIndex].exercises[exerciseIndex].sets.findIndex(set => set._id == set_id)

        User.findByIdAndUpdate(id, { $set: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.superset_exercise`]: "" , [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.superset_weight`]: "", [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.superset_reps.$[]`]: ""  } }, { new: true }, (err, data) => {
            const workout = data.workouts.find(workout => workout.date == date)
            res.send(workout)
        })
    })

module.exports = router