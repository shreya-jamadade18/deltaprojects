if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
console.log(process.env.secret);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utiles/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const listingroute = require("./routes/listings.js");
const reviewrout = require("./routes/review.js");
const userroute = require("./routes/user");
dbURL = process.env.ATALASDB_URL

main().then((res) => {
    console.log("connect to DB");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(dbURL);
    // await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");

};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// app.use(exlayouts);
// app.set('layout', './layouts/bplate');
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const store = MongoStore.create(

    {
        mongoUrl: dbURL,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 3600,
    })

store.on("error", () => {
    console.log("error in mongosesion store", err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

// app.get("/", (req, res) => {
//     res.send("working");
// });
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((User, done) => {
    done(null, User)
});
passport.deserializeUser((User, done) => {
    done(null, User)
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser", async(req, res) => {
//     let fakeuser = new User({
//         email: "student@gamil.com",
//         username: "delta"
//     });
//     let registeruser = await User.register(fakeuser, "hello");
//     res.send(registeruser)
// })

app.use("/listings", listingroute);
app.use("/listings/:id/reviews/", reviewrout);
app.use("/", userroute);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Somthing went wrong !" } = err;
    res.status(statusCode).render(__dirname + "/views/listings/Error.ejs", { message })
});

app.listen(8080, () => {
    console.log("server is listning to port 8080");
});