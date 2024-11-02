const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review= require("../models/review.js");


const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error){
       let errMsg =  error.details.map((el) => el.message).join(",");
     throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
};

//reviews
// post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    console.log(req.body);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   console.log("review saved");

    res.redirect(`/listings/${listing._id}`); 
}));

//reviews delete route

router.delete("/:reviewId" , wrapAsync(async (req,res) => {
  let {id , reviewId} = req.params;

  await Listing.findByIdAndUpdate(id, {$pull :{reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}));

module.exports = router;