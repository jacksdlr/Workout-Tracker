const router = require("express").Router()

const { User } = require("../models/models")

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
    const { exercise_name, newName, date } = req.body

    const user = await User.findById(id)

    const dateIndex = user.workouts.findIndex(workout => workout.date == date)

    const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

    User.findByIdAndUpdate(id, { $set: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.exercise_name`]: newName } }, { new: true }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred, please try again later" })
        }
        const workout = data.workouts.find(workout => workout.date == date)
        res.send(workout)
    })
})

router.post("/exercise_comments", checkAuthenticated, async (req, res) => {
    const { id } = req.user
    const { exercise_name, commentIndex, editedComment, date } = req.body

    const user = await User.findById(id)

    const dateIndex = user.workouts.findIndex(workout => workout.date == date)

    const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

    User.findByIdAndUpdate(id, { $set: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.comments.${commentIndex}`]: editedComment } }, { new: true }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred, please try again later" })
        }
        const workout = data.workouts.find(workout => workout.date == date)
        res.send(workout)
    })
})

router.post("/weight", checkAuthenticated, async (req, res) => {
    const { id } = req.user
    const { exercise_name, set_id, newWeight, date } = req.body

    const user = await User.findById(id)

    const dateIndex = user.workouts.findIndex(workout => workout.date == date)

    const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

    const weightIndex = user.workouts[dateIndex].exercises[exerciseIndex].sets.findIndex(set => set._id == set_id)

    User.findByIdAndUpdate(id, { $set: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.set_weight`]: newWeight } }, { new: true }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred, please try again later" })
        }
        const workout = data.workouts.find(workout => workout.date == date)
        res.send(workout)
    })
})

router.post("/reps", checkAuthenticated, async (req, res) => {
    const { id } = req.user
    const { exercise_name, set_id, repsIndex, newReps, date } = req.body

    const user = await User.findById(id)

    const dateIndex = user.workouts.findIndex(workout => workout.date == date)

    const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

    const weightIndex = user.workouts[dateIndex].exercises[exerciseIndex].sets.findIndex(set => set._id == set_id)

    User.findByIdAndUpdate(id, { $set: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.set_reps.${repsIndex}`]: newReps } }, { new: true }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred, please try again later" })
        }
        const workout = data.workouts.find(workout => workout.date == date)
        res.send(workout)
    })
})

router.post("/set_comments", checkAuthenticated, async (req, res) => {
    const { id } = req.user
    const { exercise_name, set_id, commentIndex, editedComment, date } = req.body

    const user = await User.findById(id)

    const dateIndex = user.workouts.findIndex(workout => workout.date == date)

    const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

    const weightIndex = user.workouts[dateIndex].exercises[exerciseIndex].sets.findIndex(set => set._id == set_id)

    User.findByIdAndUpdate(id, { $set: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.comments.${commentIndex}`]: editedComment } }, { new: true }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred, please try again later" })
        }
        const workout = data.workouts.find(workout => workout.date == date)
        res.send(workout)
    })
})

router.post("/superset_name", checkAuthenticated, async (req, res) => {
    const { id } = req.user
    const { exercise_name, newName, set_id, date } = req.body

    const user = await User.findById(id)

    const dateIndex = user.workouts.findIndex(workout => workout.date == date)

    const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

    const weightIndex = user.workouts[dateIndex].exercises[exerciseIndex].sets.findIndex(set => set._id == set_id)

    User.findByIdAndUpdate(id, { $set: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.superset_exercise`]: newName } }, { new: true }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred, please try again later" })
        }
        const workout = data.workouts.find(workout => workout.date == date)
        res.send(workout)
    })
})

router.post("/superset_weight", checkAuthenticated, async (req, res) => {
    const { id } = req.user
    const { exercise_name, set_id, newWeight, date } = req.body

    const user = await User.findById(id)

    const dateIndex = user.workouts.findIndex(workout => workout.date == date)

    const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

    const weightIndex = user.workouts[dateIndex].exercises[exerciseIndex].sets.findIndex(set => set._id == set_id)

    User.findByIdAndUpdate(id, { $set: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.superset_weight`]: newWeight } }, { new: true }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred, please try again later" })
        }
        const workout = data.workouts.find(workout => workout.date == date)
        res.send(workout)
    })
})

router.post("/superset_reps", checkAuthenticated, async (req, res) => {
    const { id } = req.user
    const { exercise_name, set_id, repsIndex, newReps, date } = req.body

    const user = await User.findById(id)

    const dateIndex = user.workouts.findIndex(workout => workout.date == date)

    const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

    const weightIndex = user.workouts[dateIndex].exercises[exerciseIndex].sets.findIndex(set => set._id == set_id)

    User.findByIdAndUpdate(id, { $set: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.superset_reps.${repsIndex}`]: newReps } }, { new: true }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "An error occurred, please try again later" })
        }
        const workout = data.workouts.find(workout => workout.date == date)
        res.send(workout)
    })
})

module.exports = router