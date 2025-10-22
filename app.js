// Check for NODE_ENV is not set on "production".
if(process.env.NODE_ENV != "production"){
   require("dotenv").config();
}

const express = require("express");
const app =express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter =require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const session = require("express-session");
const MongStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");



// Mongoose (db connection) //
//const Mongo_URL = "mongodb://127.0.0.1:27017/wanderinghub";      
const dbUrl = process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main() {                                              
    await mongoose.connect(dbUrl);
}

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


// Connect Mongo
const store =  MongStore.create({
    mongoUrl : dbUrl,
    crypto  :{
         secret : process.env.SECRET
    },
    touchAfter: 24 * 3600.
});

store.on("error",()=>{
    console.log("ERROR IN MONGO STORE",err);
});

// Implementing Sessions (express-session) // 
const sessionOptions = {
    store ,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000  ,  // line means the cookie will expire after current date  + 7days * 24 hours * 60minute/day * 60seconds/minute * 1000ms/seconds          
        maxAge:  7 * 24 * 60 * 60 * 1000   ,      
        httpOnly : true                               // For Security purpose (saves from cross scripting attacks)                                      
    } 

}





//express-session
app.use(session(sessionOptions));
// connect-flash
app.use(flash());
// passport-initialize
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //uses static authenticate method of model in LocalStrategy // 

passport.serializeUser(User.serializeUser()); // used by passport to serialize users into the session //   // a user logins into the session it is serialized//
passport.deserializeUser(User.deserializeUser()); // used by passport to deserialize users into the session //  // a user logouts into the session it is deserialized //



// Middleware for connect-flash and // user(signup,login and logout btns)
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
   // res.locals.error = req.flash("error")   // Error -DeprecationWarning: The `util.isArray` API is deprecated. Please use `Array.isArray()` instead.// 
   res.locals.currUser = req.user;
   next();
});


// Code for Router //
app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})

// Error Handling Middlware
app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something Went Wrong"} = err;
  //  res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message}); 
});

app.listen(8080,() =>{
    console.log("server is running on port 8080");
});