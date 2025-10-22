const express = require("express");
const router =express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const userController = require("../controllers/users");
const { route } = require("./listing");


// SIGN UP
router
.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup));

//LOGIN
router
.route("/login")
.get(userController.renderLoginForm)
.post(passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

//LOGOUT
router.get("/logout",userController.logout);


module.exports = router;