const { User } = require("./models/models")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

const initialize = (passport) => {
    const authenticateUser = (username, password, done) => {
        User.findOne({username}, (err, user) => {
            if (err) {
                return done(null, false, {message: "User does not exist"})
            }

            try {
                if (bcrypt.compare(password, user.password)) {
                    return (done(null, user))
                } else {
                    return done(null, false, {message: "Password incorrect"})
                }
            } catch (err) {
                return done(err)
            }
        })
    }
    passport.use(new LocalStrategy({usernameField: "username"}), authenticateUser)
    passport.serializeUser((user, done) => {

    })
    passport.deserializeUser((id, done) => {
        
    })
}

module.exports = initialize