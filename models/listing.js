const mongoose = require("mongoose");
const reviews = require("./reviews");
const { ref } = require("joi");
const Schema = mongoose.Schema;
const Review = require("./reviews.js")

const listingSchema = new Schema({
    title:{
       type: String,
       required:true,
    },
    description:String,
    image: {
    url : String,
    filename:String
  },  
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type : Schema.Types.ObjectId,
        ref: "Review",                       // important : From reviews.js //
      }
    ],
    owner : {
      type : Schema.Types.ObjectId,
      ref: "User",
    },
    geometry : {
      type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
});
// Mongoose Middleware (when a listing is deleted their reviews also gets deleted from the database) // 
listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;