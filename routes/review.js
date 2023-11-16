const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utiles/wrapasync");
const ExpressError = require("../utiles/ExpressError.js");
const Review = require("../models/review.js");
const List = require("../models/listing.js");
const { validatereview, isLoggedin, isreviewAuthor } = require("../middleware.js");
const review = require("../models/review.js");
const reviewController = require("../controllers/review.js")


//reviews route
router.post("/", isLoggedin, validatereview, wrapasync(reviewController.review));
//delete review route
router.delete("/:reviewId", isLoggedin, isreviewAuthor, wrapasync(async(req, res) => {
    let { id, reviewId } = req.params;
    await Review.findById(reviewId);
    await List.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;