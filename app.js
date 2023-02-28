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
app.use("/", bodyParser.json())
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
app.route("/")
    .get(checkAuthenticated, (req, res) => {
        res.render("index", { username: req.user.username })
    })

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
app.route("/workouts")
    /*.get(checkAuthenticated, (req, res) => {
        const {id} = req.user
    }) <-- GET ALL USER WORKOUTS??? */
    .post(checkAuthenticated, async (req, res) => {
        // Get user's MongoDB _id from passport
        const { id, username } = req.user
        // Get form inputs
        let {
            date,
            exercise_name,
            set_weight,
            set_weight_unit,
            set_reps,
            superset,
            comment
        } = req.body
        // Suffix the weight unit from form if exercise weight has been given
        if (set_weight) {
            set_weight = `${set_weight}${set_weight_unit}`
        } else {
            set_weight = undefined
        }  
        if (set_reps == "") {
            set_reps = undefined
        }

        // Define superset variables if form checkbox is checked
        if (superset == "on") {
            var {
                superset_exercise,
                superset_weight,
                superset_weight_unit,
                superset_reps
            } = req.body
            if (superset_weight) {
                superset_weight = `${superset_weight}${superset_weight_unit}`
            } else {
                superset_weight = undefined
            }
            if (superset_reps == "") {
                superset_reps = undefined
            }
        }

        // Define set, exercise, and workout objects for database
        const newSet = new Set({
            set_weight,
            set_reps,
            superset_exercise,
            superset_weight,
            superset_reps
        })
        const newExercise = new Exercise({
            exercise_name,
            sets: newSet,
            comments: comment
        })
        const newWorkout = new Workout({
            date,
            exercises: newExercise
        })

        // Find if a workout for the user has already been created
        const existingWorkout = await User.aggregate([
            { $unwind: "$workouts" },
            { $match: { _id: ObjectId(id), "workouts.date": date } }
        ])

        //data.workouts.find(workout => workout.date == date) USE THIS LATER

        if (existingWorkout == "") {
            User.findByIdAndUpdate(id, { $push: { workouts: newWorkout } }, { new: true }, (err, data) => {
                if (err) {
                    res.status(400).send({ error: "Something went wrong" })
                } else {
                    console.log("Added new workout!") // !!! ENDS HERE !!!
                    return
                }
            })
        } else {
            const query = { _id: ObjectId(id), "workouts.date": date }

            // Find if an existing workout already has the exercise added
            const existingExercise = await User.aggregate([
                { $unwind: "$workouts" },
                { $unwind: "$workouts.exercises" },
                { $match: { _id: ObjectId(id), "workouts.date": date, "workouts.exercises.exercise_name": exercise_name } }
            ])

            if (existingExercise == "") {
                User.findOneAndUpdate(query, { $push: { "workouts.$.exercises": newExercise } }, { new: true }, (err, data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Added new exercise!")
                        return
                    }
                })
            } else {
                const exerciseIndex = existingWorkout[0].workouts.exercises.findIndex(exercise => exercise.exercise_name == exercise_name)

                // Find if a set has been done with the same weight, reps, etc.
                const existingSet = existingWorkout[0].workouts.exercises[exerciseIndex].sets.find(set =>
                    set.set_reps == set_reps &&
                    set.set_weight == set_weight &&
                    set.superset_exercise == superset_exercise &&
                    set.superset_weight == superset_weight &&
                    set.superset_reps == superset_reps
                )
                
                if (!existingSet) {
                    User.findOneAndUpdate(query, { $push: { [`workouts.$.exercises.${exerciseIndex}.sets`]: newSet } }, { new: true }, (err, data) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("Added new set!")
                            return
                        }
                    })
                } else {
                    const setIndex = existingWorkout[0].workouts.exercises[exerciseIndex].sets.findIndex(set =>
                        set.set_reps == set_reps &&
                        set.set_weight == set_weight &&
                        set.superset_exercise == superset_exercise &&
                        set.superset_weight == superset_weight &&
                        set.superset_reps == superset_reps
                    )
                    User.findOneAndUpdate(query, { $inc: { [`workouts.$.exercises.${exerciseIndex}.sets.${setIndex}.sets_count`]: 1 } }, { new: true }, (err, data) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("Updated set count!")
                            return
                        }
                    })
                }
            }

        }



        /*
                User.findById(id, (err, user) => {
                    if (err || !user) {
                        res.status(400).send({error: "Could not find user"})
                        console.log(err)
                        return
                    }
                    const newSet = new Set({
                        set_weight,
                        set_reps,
                        superset_exercise,
                        superset_weight,
                        superset_reps
                    })
                    const newExercise = new Exercise({
                        exercise_name,
                        sets: newSet,
                        comments: comment
                    })
                    const newWorkout = new Workout({
                        date,
                        exercises: newExercise
                    })
                    /*
                    if (!user.workouts.find(workout => workout.date == date)) {
                        console.log("not found!")
                        User.findByIdAndUpdate(id, {$push: {date, workouts: newWorkout}}, {new: true}, (err, user) => {
                            if (err) {
                                res.status(400).send({error: "Something went wrong"})
                            } else {
                                console.log(user)
                            }
                        })
                    } else {
                        console.log("found it!")
                        
                    }
                    */

        //})
    })

const port = 3000

app.listen(port, console.log(`App is listening on port ${port}...`))