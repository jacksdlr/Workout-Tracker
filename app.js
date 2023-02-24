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

const {Set, Exercise, Workout, User} = require("./models/models")

const app = express();

// Middleware
app.set("view engine", "pug")
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use("/", bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use("/public", express.static(process.cwd()+ "/public"))
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
        res.render("index", {username: req.user.username})
    })

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
            const {username, password} = req.body
            const hashedPassword = await bcrypt.hash(password, 10)
            User.findOne({username}, (err, existingUser) => {
                if (existingUser) {
                    res.render("login-signup", {signupError: "User already exists"})
                } else {
                    User.create({
                        username,
                        password: hashedPassword
                    }, (err, newUser) => {
                        if (err) {
                            res.status(400).send(err)
                        } else {
                            res.render("login-signup", {message: "Successfully created account, please login"}) // MIGHT NEED TO CHANGE THIS 13:45 IN VIDEO
                        }
                    })
                }
            })
        } catch {
            res.redirect("/signup")
        }
    })

const port = 3000

app.listen(port, console.log(`App is listening on port ${port}...`))

// 28:48, maybe rewind to implement error messages