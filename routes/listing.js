const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if (error){
       let errMsg =  error.details.map((el) => el.message).join(",");
     throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
};

// index route
router.get("/" ,wrapAsync(async (req , res) =>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs" , { allListings });
     }));
     
 // new route
 router.get("/new" , (req,res)=>{
    console.log(req.user);
    if(!req.isAuthenticated()) {
        req.flash("error" , "you must be logged in to create listing!");
       return res.redirect("/login");
    }
     res.render("listings/new.ejs");
 });
 
 //show route 
 router.get("/:id" , wrapAsync(async(req,res,next) =>{
     let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error" , "Listing requested by you does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
 }) );   
 // create route
 router.post("/" , validateListing , wrapAsync(async (req,res)=>{
    try {
         const newListing = new Listing(req.body.listing);
         await newListing.save();
         req.flash("success" , "New listing created!");
         res.redirect("/listings");
        }catch{
            req.flash("error" , "something went wrong");
            res.redirect("/listings/new");
        }
 }));
 
 // edit route
 router.get("/:id/edit" , wrapAsync(async (req,res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error" , "Listing requested by you does not exist!");
        res.redirect("/listings");
    }
     res.render("listings/edit.ejs" , {listing});
 }));
 //update route
 router.put("/:id" , validateListing , wrapAsync(async (req,res)=>{
     let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    req.flash("success" , "Listing updated!");
    res.redirect(`/listings/${id}`);
 }));
 
 //delete route
 router.delete("/:id" , wrapAsync(async (req,res)=>{
     let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , " listing was deleted!");
    res.redirect("/listings");
 }));
 

 module.exports = router;