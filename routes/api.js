module.exports = (app) => {
    // Body parser module
    const bodyParser = require("body-parser")
    app.use("/", bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    // Mongoose and MongoDB setup
    const mongoose = require("mongoose")
    const ObjectId = mongoose.Types.ObjectId
    const {Schema} = require ("mongoose")
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})

    // Mongoose schemas
    const setSchema = new Schema({
        set_weight: String,
        set_reps: Number,
        superset_exercise: String,
        superset_weight: String,
        superset_reps: Number
    }, {versionKey: false})

    const exerciseSchema = new Schema({
        exercise_name: String,
        sets: [setSchema]
    }, {versionKey: false})

    const workoutSchema = new Schema({
        date: {Date},
        exercises: [exerciseSchema]
    }, {versionKey: false})

    const Set = mongoose.model("Set", setSchema)
    const Exercise = mongoose.model("Exercise", exerciseSchema)
    const Workout = mongoose.model("Workout", workoutSchema)

    app.route("/api/exercises/:workout")
        .get((req, res) => {
            res.send(`success. workout = ${req.params.workout}`)
        })

        .post((req, res) => {
            console.log(req.body)
        })
}