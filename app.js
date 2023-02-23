const express = require("express")
const pug = require("pug")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")

require("dotenv").config();

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

// Routes
app.route("/")
    .get((req, res) => {
        res.render("index")
    })

app.route("/login")
    .get((req, res) => {
        res.render("login-signup")
    })
    .post((req, res) => {

    })

app.route("/signup")
    .get((req, res) => {
        res.render("login-signup")
    })
    .post(async (req, res) => {
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
                            res.redirect("/") // MIGHT NEED TO CHANGE THIS 13:45 IN VIDEO
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