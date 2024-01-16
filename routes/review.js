const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
//REview


router.post("/",wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    const newReview = new Review({
       comment: req.body.review.comment,
       rating: req.body.review.rating,
     });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new rev saved");
    req.flash("success","New review added! ");
   res.redirect(`/listings/${listing._id}`);
   }));
   //del route for review
   
       router.delete("/:reviewId", wrapAsync(async (req, res) => {
       let { id,reviewId}=req.params;
       const review = await Review.findById(reviewId);
       const listing = await Listing.findById(id);
       await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
       await Review.findByIdAndDelete(reviewId);
       req.flash("success","Review deleted! ");
   res.redirect(`/listings/${listing._id}`);
   }));

   module.exports=router;