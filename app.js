if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express")
const pug = require("pug")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const initializePassport = require("./passport-config")
initializePassport(passport)

const mongoose = require("mongoose")
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const ObjectId = mongoose.Types.ObjectId

const { Set, Exercise, Workout, User } = require("./models/models")

const app = express();

// Middleware
app.set("view engine", "pug")
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/public", express.static(process.cwd() + "/public"))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
} // PUT THIS ANYWHERE THE USER NEEDS TO BE LOGGED IN (viewing all workouts, etc.)

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
} // PUT THIS ANYWHERE THAT A LOGGED IN USER SHOULD NOT BE VISITING (login page, etc.)

// Routes


// LOGIN/SIGNUP PAGE ROUTES
app.route("/login")
    .get(checkNotAuthenticated, (req, res) => {
        res.render("login-signup")
    })
    .post(checkNotAuthenticated, passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }))

app.route("/signup")
    .get(checkNotAuthenticated, (req, res) => {
        res.render("login-signup")
    })
    .post(checkNotAuthenticated, async (req, res) => {
        try {
            const { username, email, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10)
            User.findOne({ email }, (err, existingEmail) => {
                if (existingEmail) {
                    res.render("login-signup", { signupError: "Email already in use" })
                } else {
                    User.findOne({ username }, (err, existingUsername) => {
                        if (existingUsername) {
                            res.render("login-signup", { signupError: "Username already in use" })
                        } else {
                            User.create({
                                username,
                                email,
                                password: hashedPassword
                            }, (err, newUser) => {
                                if (err) {
                                    res.status(400).send(err)
                                } else {
                                    res.render("login-signup", { message: "Successfully created account, please login" }) // MIGHT NEED TO CHANGE THIS 13:45 IN VIDEO
                                }
                            })
                        }
                    })
                }
            })
        } catch {
            res.redirect("/signup")
        }
    })

app.route("/logout")
    .get((req, res, next) => {
        req.logOut((err) => {
            if (err) {
                return next(err)
            }
            res.redirect("/login")
        })
    })

// WORKOUT CREATION ROUTES
app.route("/")
    .get(checkAuthenticated, (req, res) => {
        const { id, username } = req.user
        
        let date = new Date().toISOString().split("T")[0]
        res.render("index", {
            date,
            username
        })
    })
    .post(checkAuthenticated, async (req, res) => {
        // Get user's MongoDB _id from passport
        const { id, username } = req.user
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

        if (req.body.superset == "on" && !superset_reps) {
                superset_reps = "?"
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
                    res.status(400).send({ error: "Something went wrong" })
                } else {
                    console.log("Added new workout!") // !!! ENDS HERE !!!
                    res.redirect("/")
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
                        console.log(err)
                    } else {
                        console.log("Added new exercise!")
                        res.redirect("/")
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
                            console.log(err)
                        } else {
                            console.log("Added new weight!")
                            res.redirect("/")
                        }
                    })
                } else {
                    const weightIndex = existingWorkout.workouts.exercises[exerciseIndex].sets.findIndex(set =>
                        set.set_weight == set_weight &&
                        set.superset_exercise == superset_exercise &&
                        set.superset_weight == superset_weight
                    )
                    if (!set_comment) {
                        User.findOneAndUpdate(query, { $inc: { [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.sets_count`]: 1 }, $push: { [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.set_reps`]: set_reps, [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.superset_reps`]: superset_reps } }, { new: true }, (err, data) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Added new set of reps!")
                                res.redirect("/")
                                
                            }
                        })
                    } else {
                        let count = existingWeight.sets_count + 1
                        User.findOneAndUpdate(query, { $inc: { [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.sets_count`]: 1 }, $push: { [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.set_reps`]: set_reps, [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.superset_reps`]: superset_reps, [`workouts.$.exercises.${exerciseIndex}.sets.${weightIndex}.comments`]: `Set ${count}: ${set_comment}` } }, { new: true }, (err, data) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Added new set of reps and comment!")
                                res.redirect("/")
                            }
                        })
                    }

                }
            }
        }
    })

app.route("/workouts/:date")
    .get(checkAuthenticated, (req, res) => {
        User.findById(req.user._id, (err, data) => {
            const workout = data.workouts.find(workout => workout.date == req.params.date)
            res.send(workout)
        })
    })

const port = 3000

app.listen(port, console.log(`App is listening on port ${port}...`))