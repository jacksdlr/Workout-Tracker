module.exports = (app) => {
    const passport = require("passport")
    const bcrypt = require("bcrypt")

    const { User } = require("../models/models")

    const checkNotAuthenticated = (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect("/")
        }
        next()
    }

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
                if (!username.match(/^[a-z0-9_-]{3,15}$/i)) {
                    res.render("login-signup", { signupError: "Invalid username (3-15 letters, numbers, and _ or - special characters)" })
                    return
                // Minimum 8 characters, one uppercase, one lowercase, and one number
                } else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
                    res.render("login-signup", { signupError: "Invalid password (must include one uppercase letter, one lowercase letter, and one number)" })
                    return
                }
                User.findOne({ email }, (err, existingEmail) => {
                    if (existingEmail) {
                        res.render("login-signup", { signupError: "Email already in use" })
                    } else {
                        User.findOne({ username: new RegExp(`^${username}$`, "i") }, (err, existingUsername) => {
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
                res.redirect("/")
            })
        })
}