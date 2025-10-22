const User = require("../models/user");


// signup user
module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User ({email,username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(err)=>{                        
            if(err) {                                           //This if statements says if a user has
                return next(err);                               // signed up then he doesnot have to login 
            }                                                   // again and will be shown only the logout option 
            req.flash("sucess","Welcome to Wandering Hub");     // or it logs in them immideatly after sign up
            res.redirect("/listings");
        })
    }catch(error){
        req.flash("success",error.message);
        res.redirect("/signup");
    }
};

//login
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
   req.flash("success","Welcome Back to Wandering Hub");
   res.redirect("/listings");
};

//logout
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","you are logged out !");
        res.redirect("/listings");
    })
};