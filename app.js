const express = require("express")
const pug = require("pug")


require("dotenv").config();

const mongoose = require("mongoose")
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const app = express();
const bodyParser = require("body-parser")
    app.use("/", bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))

const apiRoutes = require("./routes/api.js")

// Middleware
app.use(express.json())
app.set("view engine", "pug")

// Routes
app.use("/public", express.static(process.cwd()+ "/public"))

app.route("/").get((req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login-signup")
})
app.get("/signup", (req, res) => {
    res.render("login-signup")
})

apiRoutes(app)

const port = 3000

app.listen(port, console.log(`App is listening on port ${port}...`))