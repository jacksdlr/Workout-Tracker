const mongoose = require("mongoose")
const Schema = mongoose.Schema

const setSchema = new Schema({
    set_weight: {type: String, set: a => a === '' ? undefined : a},
    set_reps: {type: Number, set: a => a === null ? undefined : a},
    superset_exercise: {type: String, set: a => a === '' ? undefined : a},
    superset_weight: {type: String, set: a => a === '' ? undefined : a},
    superset_reps: {type: Number, set: a => a === null ? undefined : a},
}, {versionKey: false})

const exerciseSchema = new Schema({
    exercise_name: String,
    sets: [setSchema],
    comments: [String]
}, {versionKey: false})

const workoutSchema = new Schema({
    date: String,
    exercises: [exerciseSchema]
}, {versionKey: false})

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
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