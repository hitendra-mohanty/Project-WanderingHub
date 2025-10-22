const express = require("express");
const router =express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const reviewSchema = require("../schema2.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

const validateReview = (req,res,next) =>{
   let {error} =  reviewSchema.validate(req.body);                             // validation for schema (schema.js)(joi dependency) //  
   if(error){              
    throw new ExpressError(400,errMsg)
   }else{
    next();
   }    
}

// Reviews Routes 
// POST Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review Route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));


module.exports = router;