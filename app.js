const express = require("express")

require("dotenv").config();

const mongoose = require("mongoose")
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const app = express();

const apiRoutes = require("./routes/api.js")

// Middleware
app.use(express.json())

// Routes
app.use("/public", express.static(process.cwd()+ "/public"))

app.route("/").get((req, res) => {
    res.sendFile(process.cwd() + "/public/index.html")
})

apiRoutes(app)

const port = 3000

app.listen(port, console.log(`App is listening on port ${port}...`))