const User = require("../models/user.js");
module.exports.signup = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signpost = async(req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registeruser = await User.register(newuser, password);
        console.log(registeruser);
        req.login(registeruser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcom to Wanderlust");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.login = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginpost = async(req, res) => {
    req.flash("success", "welcome");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next();
        }
        req.flash("success", "You are logged out now");
        res.redirect("/listings");
    })
}