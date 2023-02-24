const mongoose = require("mongoose")
const Schema = mongoose.Schema

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

const userSchema = new Schema({
    username: String,
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