const mongoose = require("mongoose");
const initData = require("../init/data.js");            // Exports sample data from data.js // 
const Listing = require("../models/listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderinghub";      
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main() {                                              
    await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
   await Listing.deleteMany({});                   /// deletes if there is any existing data in the database //
   initData.data = initData.data.map((obj)=> ({
    ...obj , owner :"68f52991ac3df17eb418b89f"
   }));                                  
   await Listing.insertMany(initData.data);    /// inserts sampleListings data from data.js ///
   console.log("Data was initialised")
};

initDB();