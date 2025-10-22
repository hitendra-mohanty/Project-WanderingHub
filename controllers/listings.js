const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// Index
module.exports.index = async(req,res)=>{
 const allListings = await Listing.find({});
 res.render("index.ejs",{allListings});      
};

//New
module.exports.renderNewForm = (req,res)=>{
    res.render("new.ejs");
};

//Show
module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); // .populate(owner) is used for ref of owner of the listing//
    if(!listing){
        req.flash("success","The Listing Does Not Exists OR Deleted By The User");
        res.redirect("/listings");
    }
    res.render("show.ejs",{listing});
};

//Create (Includes MAP)
module.exports.createListing = async(req,res,next) => {
  let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
.send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.image = {url,filename};
  newListing.owner = req.user._id;
  newListing.geometry = response.body.features[0].geometry;
  let savedListing =  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

//Edit
module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    let orignalImageUrl =  listing.image.url;                                           //    compresses the orignal image //
    orignalImageUrl = orignalImageUrl.replace("/upload","/upload/h_250,w_250");        //    to a preview form        //
    res.render("edit.ejs",{listing,orignalImageUrl});
};

//Update
module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image = {url,filename}
       await listing.save();
}
   
    req.flash("success","Listing Updated")
    res.redirect(`/listings/${id}`);
};

//Delete
module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")      // flashes a messagge when a listing is deleted // 
    res.redirect("/listings");
};
