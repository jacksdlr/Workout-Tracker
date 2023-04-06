const passport = require("passport")
const bcrypt = require("bcrypt")
const router = require("express").Router()

const { User } = require("../models/models")

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

router.get("/", (req, res) => {
    res.redirect("/")
})

router.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login-signup")
})
router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true
}))

router.get("/signup", checkNotAuthenticated, (req, res) => {
    res.render("login-signup")
})
router.post("/signup", checkNotAuthenticated, async (req, res) => {
    try {
        const { username, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        if (!username.match(/^[a-z0-9_-]{3,15}$/i)) {
            res.render("login-signup", { signupError: "Invalid username (3-15 letters, numbers, and _ or - special characters)" })
            return
            // Minimum 8 characters, one uppercase, one lowercase, and one number
        } else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\S]{8,}$/)) {
            res.render("login-signup", { signupError: "Invalid password (must include one uppercase letter, one lowercase letter, and one number)" })
            return
        }
        User.findOne({ email }, (err, existingEmail) => {
            if (err) {
                return res.status(500).json({ message: "An error occurred, please try again later." })
            }
            if (existingEmail) {
                res.render("login-signup", { signupError: "Email already in use" })
            } else {
                User.findOne({ username: new RegExp(`^${username}$`, "i") }, (err, existingUsername) => {
                    if (err) {
                        return res.status(500).json({ message: "An error occurred, please try again later" })
                    }
                    if (existingUsername) {
                        res.render("login-signup", { signupError: "Username already in use" })
                    } else {
                        User.create({
                            username,
                            email,
                            password: hashedPassword
                        }, (err, newUser) => {
                            if (err) {
                                return res.status(500).json({ message: "An error occurred, please try again later" })
                            } else {
                                res.render("login-signup", { message: "Successfully created account, please login" })
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

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
})

module.exports = router