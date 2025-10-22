const Listing = require("../Project-1/models/listing.js");
const Review = require("../Project-1/models/reviews.js");

// Example of a proper isLoggedIn middleware
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};
module.exports.isOwner =async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("success","You are Not the Owner Of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async(req,res,next) =>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("success","You are not author of this Review");
    return res.redirect(`/listings/${id}`)
  }
  next();
};

