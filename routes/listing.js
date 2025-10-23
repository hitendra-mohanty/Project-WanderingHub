const express = require("express");
const router =express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const listingSchema = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner}= require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage})


const listingController = require("../controllers/listings.js");


// Middleware For Error Handling (schema validation)
  const validateListing = (req,res,next) => {
   let {error} = listingSchema.validate(req.body);
   if(error){
    throw new ExpressError(400,error)
  } else {
    next();
}
}
// INDEX AND CREATE ROUTE
router
.route("/listings")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

// New Route 
router.get("/new",isLoggedIn,listingController.renderNewForm);

// SHOW,UPDATE AND DELETE ROUTE
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));






module.exports = router;