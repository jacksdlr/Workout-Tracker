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

router.post("/exercise_comments", checkAuthenticated, async (req, res) => {
        const { id } = req.user
        const { exercise_name, date, newComment } = req.body

        const user = await User.findById(id)

        const dateIndex = user.workouts.findIndex(workout => workout.date == date)

        const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

        User.findByIdAndUpdate(id, { $push: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.comments`]: newComment } }, { new: true }, (err, data) => {
            if (err) {
                return res.status(500).json({ message: "An error occurred, please try again later" })
            }
            const workout = data.workouts.find(workout => workout.date == date)
            res.send(workout)
        })
    })

router.post("/set_comments", checkAuthenticated, async (req, res) => {
        const { id } = req.user
        const { exercise_name, date, newComment, set_id } = req.body

        const user = await User.findById(id)

        const dateIndex = user.workouts.findIndex(workout => workout.date == date)

        const exerciseIndex = user.workouts[dateIndex].exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

        const weightIndex = user.workouts[dateIndex].exercises[exerciseIndex].sets.findIndex(set => set._id == set_id)

        User.findByIdAndUpdate(id, { $push: { [`workouts.${dateIndex}.exercises.${exerciseIndex}.sets.${weightIndex}.comments`]: newComment } }, { new: true }, (err, data) => {
            if (err) {
                return res.status(500).json({ message: "An error occurred, please try again later" })
            }
            const workout = data.workouts.find(workout => workout.date == date)
            res.send(workout)
        })
    })

module.exports = router