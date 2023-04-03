require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const MongoStore = require("connect-mongo")

const initializePassport = require("./passport-config")
initializePassport(passport)

const mongoose = require("mongoose")
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const userRoutes = require("./routes/user")
const workoutRoutes = require("./routes/workouts")
const updateRoutes = require("./routes/update")
const deleteRoutes = require("./routes/delete")
const commentRoutes = require("./routes/comments")

const app = express();

//////////////////
//  Middleware  //
//////////////////

app.set("view engine", "pug")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 31557600000
    })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use("/public", express.static(process.cwd() + "/public"))
app.use(flash())

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.render("index")
} // PUT THIS ANYWHERE THE USER NEEDS TO BE LOGGED IN (viewing all workouts, etc.)

//////////////
//  Routes  //
//////////////

app.get("/", checkAuthenticated, (req, res) => {
    const { username } = req.user
    res.render("index", { username })
})

// LOGIN/SIGNUP PAGE ROUTES
app.use("/user", userRoutes)

// WORKOUT CREATION ROUTES
app.use("/workouts", workoutRoutes)

// WORKOUT UPDATE ROUTES
app.use("/update", updateRoutes)

// WORKOUT DELETE ROUTES
app.use("/delete", deleteRoutes)

// WORKOUT NEW COMMENTS ROUTES
app.use("/comments", commentRoutes)

////////////
//  PORT  //
////////////

const PORT = process.env.PORT || 8080

app.listen(PORT, console.log(`App is listening on port ${PORT}...`))