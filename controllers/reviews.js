const Listing = require("../models/listing");
const Review = require("../models/reviews");

// Create Review
module.exports.createReview = async(req,res)=>{
   try {
   let listing =  await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   req.flash("sucess","New review Created")                      // flashes the message i.e New Review Created (with the help of connect-flash )//
   //res.redirect("/listings");
   return res.redirect(`/listings/${listing._id}`);
   }catch(err){
      res.status(500).send(error);
   }
};

//Delete Review
module.exports.deleteReview = async(req,res)=>{
   let {id,reviewId} = req.params;
   await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});            // $pull - mongo special operator //
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted");                        // flashes the message i.e  Review Deleted (with the help of connect-flash )//
   res.redirect(`/listings/${id}`);

};