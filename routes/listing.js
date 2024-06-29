const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {ListingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const {isLoggedIn}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});


router.get("/",wrapAsync(listingController.index));
router.get("/search",isLoggedIn,wrapAsync(listingController.search) );
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));
router.get("/:id",isLoggedIn,wrapAsync(listingController.show));
router.post("/",upload.single("listing[image]"),isLoggedIn, wrapAsync(listingController.createListings) );




//    router.put("/:id", upload.single("listing[image]"), isLoggedIn, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const { listing } = req.body;

//     if (!listing) {
//         req.flash("error", "Send valid data for the listing");
//         return res.redirect(`/listings/${id}/edit`);
//     }

//     // Fetch the listing
//     const findlisting = await Listing.findById(id);
//     if (!findlisting) {
//         req.flash("error", "Listing not found");
//         return res.redirect(`/listings/${id}/edit`);
//     }

//     if (!findlisting.owner.equals(res.locals.curruser._id)) {
//         req.flash("error", "You don't have permission to edit, only the owner can!");
//         return res.redirect(`/listings/${id}`);
//     }

//     if (typeof req.file !== "undefined") {
//         let uplisting = await Listing.findByIdAndUpdate(id, { ...listing }, { new: true });
//         let url = req.file.path;
//         let filename = req.file.filename;
//         uplisting.image = { url, filename };
//         await uplisting.save();
        
//     }
 
//     req.flash("success", "Listing updated successfully!");
//     res.redirect(`/listings/${id}`);
// }));

router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested does not exist!");
            return res.redirect("/listings");
        }
        let oriurl=listing.image.url;
        oriurl=oriurl.replace("/upload","/upload/h_300,w_250");
        res.render("listings/edit.ejs", { listing,oriurl });
    } catch (err) {
        console.error(err);
        req.flash("error", "An error occurred while fetching the listing");
        res.redirect("/listings");
    }
}));


  router.put("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
   let {id}=req.params;
  //  if(!req.body.listing){
  //      throw new ExpressError(400,"Send valid data for listing");
  //  }
   
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated! ");
    res.redirect(`/listings/${id}`);
   }));       
      
// router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
    
//     if (!listing) {
//       req.flash("error", "Listing you requested does not exist!");
//       return res.redirect("/"); 
//     }
  
//     res.render("listings/edit.ejs", { listing });
//   }));



 router.delete("/:id",isLoggedIn,wrapAsync(listingController.destroy));

// GET listings by category
router.get("/category/:category", async (req, res) => {
    const { category } = req.params;
    try {
      const listings = await Listing.find({ category: category });
      res.json(listings);
    } catch (err) {
      console.error("Error fetching listings by category:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
module.exports=router;