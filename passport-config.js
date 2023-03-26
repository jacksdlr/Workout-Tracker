const { User } = require("./models/models")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

const initialize = (passport) => {
    const authenticateUser = (username, password, done) => {
        User.findOne({username}, (err, user) => {
            if (!user) {
                return done(null, false, {message: "No such user exists"})
            }
            if (bcrypt.compareSync(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: "Password incorrect"})
            }
        })
        
    }
    passport.use(new LocalStrategy({usernameField: "username"}, authenticateUser))
    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            if (!err) {
                return done(null, user)
            }
        })
    })
}

module.exports = initialize