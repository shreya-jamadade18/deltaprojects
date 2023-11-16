const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utiles/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/user.js")

router.get("/signup", (usercontroller.signup))
    .post("/signup", wrapasync(usercontroller.signpost));

router.get("/login", (usercontroller.login))
    .post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), (usercontroller.loginpost));

router.get("/logout", (usercontroller.logout));

module.exports = router;