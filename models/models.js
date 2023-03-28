const mongoose = require("mongoose")
const Schema = mongoose.Schema

const setSchema = new Schema({
    set_weight: String,
    set_reps: [String],
    superset_exercise: String,
    superset_weight: String,
    superset_reps: [String],
    comments: [String],
    sets_count: {type: Number, default: 1}
}, {versionKey: false})

const exerciseSchema = new Schema({
    exercise_name: {type: String, required: true},
    sets: [setSchema],
    comments: [String]
}, {versionKey: false})

const workoutSchema = new Schema({
    date: String,
    exercises: [exerciseSchema]
}, {versionKey: false})

const userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    workouts: [workoutSchema]
}, {versionKey: false})

const Set = mongoose.model("Set", setSchema)
const Exercise = mongoose.model("Exercise", exerciseSchema)
const Workout = mongoose.model("Workout", workoutSchema)
const User = mongoose.model("User", userSchema)

module.exports = {
    Set,
    Exercise,
    Workout,
    User
}