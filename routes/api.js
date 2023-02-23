module.exports = (app) => {
    // Body parser module
    const bodyParser = require("body-parser")
    app.use("/", bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    // Mongoose and MongoDB setup
    const mongoose = require("mongoose")
    const ObjectId = mongoose.Types.ObjectId
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})

    app.route("/:user/:workout")
        .get((req, res) => {
            res.send(`success. workout = ${req.params.workout}`)
        })

        .post((req, res) => {
            res.send(req.params)
        })

    app.route("/user/:username")
        .post((req, res) => {
            res.send(req.body)
        })
}