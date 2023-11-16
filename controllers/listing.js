const List = require("../models/listing");

module.exports.index = async(req, res) => {
    const allList = await List.find({});
    res.render("listings/index.ejs", { allList });
};

module.exports.createroute = async(req, res, next) => {

    try {
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new List(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success", "New listing created");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

module.exports.newroute = (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login")
    }
    res.render("listings/new.ejs");
};

module.exports.showroute = async(req, res) => {
    let { id } = req.params;
    const listing = await List.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "listing you requested for dose not exists")
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEdit = async(req, res, next) => {
    let { id } = req.params;
    const listing = await List.findById(id);
    if (!listing) {
        req.flash("error", "not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateroute = async(req, res) => {
    let { id } = req.params;
    let listing = await List.findByIdAndUpdate(id, {...req.body.listing });
    if (req.file && req.file.path && req.file.filename) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyroute = async(req, res) => {
    let { id } = req.params;
    let deletelist = await List.findByIdAndDelete(id);
    console.log(deletelist);
    req.flash("success", " listing deleted");
    res.redirect("/listings");
}