const express = require("express")
const pug = require("pug")
const bodyParser = require("body-parser")

require("dotenv").config();

const mongoose = require("mongoose")
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const {Set, Exercise, Workout, User} = require("./models/models")

const app = express();

// Middleware
app.set("view engine", "pug")
app.use(express.json())
app.use("/", bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use("/public", express.static(process.cwd()+ "/public"))

// Routes
app.route("/")
    .get((req, res) => {
        res.render("index")
    })

app.get("/login", (req, res) => {
    res.render("login-signup")
})
app.get("/signup", (req, res) => {
    res.render("login-signup")
})

const port = 3000

app.listen(port, console.log(`App is listening on port ${port}...`))