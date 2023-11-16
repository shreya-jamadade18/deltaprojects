const List = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.review = async(req, res) => {
    let { id } = req.params;
    let listing = await List.findById(id).populate("reviews");
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created");
    res.redirect(`/listings/${listing._id}`);

}