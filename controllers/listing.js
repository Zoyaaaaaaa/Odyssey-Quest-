const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const {ListingSchema,reviewSchema}=require("../schema.js");
module.exports.index=async(req,res)=>{
    const alllist=await Listing.find({});
     // res.json(alllist);
     
    res.render("listings/index.ejs",{alllist});
};
module.exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    const listings = await Listing.findByTitle(query);
    res.render('listings/search.ejs', { listings, query });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
module.exports.renderNewForm=async(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.show=async(req,res)=>{
    let{id}=req.params;
      const listing= await Listing.findById(id)
      .populate({
        path:"reviews",
        populate:{
        path:"author",
      },
      }).populate("owner");
      if(!listing){
        req.flash("error","Listing you requested does not exist!");
       return res.redirect("/listings");
      }
      
       res.render("listings/show.ejs",{listing});
}
module.exports.createListings = async (req, res, next) => {
  try {
    let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    }).send();

 
    let result = ListingSchema.validate(req.body);

    if (result.error) {
      throw new ExpressError(400, result.error);
    }

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();

    console.log(savedListing);
    req.flash("success", "New Listing Added! ");
    res.redirect("/listings");
  } catch (err) {
    // Handle errors, log them, and possibly send an error response
    console.error(err);
    next(err); // Pass the error to the next middleware or error handler
  }
};

module.exports.destroy=async(req,res)=>{
    let{id}=req.params;
    let del= await Listing.findByIdAndDelete(id);
    console.log(del);
    req.flash("success","Listing deleted! ");
    res.redirect("/listings");
}
