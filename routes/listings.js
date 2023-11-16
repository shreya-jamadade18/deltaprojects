const express = require("express");
const router = express.Router();
const wrapasync = require("../utiles/wrapasync");
const List = require("../models/listing.js");
const { isLoggedin, isOwner, validatelisting } = require("../middleware.js")
const multer = require("multer");
const { storage } = require("../CloudConfig.js")
const upload = multer({ storage });
const listingController = require("../controllers/listing.js");
const listing = require("../models/listing.js");


//index route
router
    .route("/")
    .get(wrapasync(listingController.index))
    .post(isLoggedin, upload.single("listing[image]"), validatelisting, wrapasync(listingController.createroute))

//new route
router.get("/new", isLoggedin, (listingController.newroute));

//show route
router
    .route("/:id")
    .get(wrapasync(listingController.showroute))
    .put(isLoggedin, isOwner, upload.single("listing[image]"), validatelisting, wrapasync(listingController.updateroute))
    .delete(isLoggedin, isOwner, wrapasync(listingController.destroyroute));


//edit route
router
    .route("/:id/edit")
    .get(isLoggedin, isOwner, wrapasync(listingController.renderEdit));

module.exports = router;