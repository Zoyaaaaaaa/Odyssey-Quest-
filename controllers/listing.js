const Listing=require("../models/listing");
const { ListingSchema, reviewSchema } = require("../schema.js");
const axios = require("axios");
const maptilerApiKey = 'Wars20G8uapWIPRAZqLg';

const geocode = async (address) => {
  try {
    const response = await axios.get(`https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json`, {
      params: {
        key: maptilerApiKey,
        limit: 1 // Optional: limit the number of results
      }
    });

    if (response.data && response.data.features && response.data.features.length > 0) {
      return response.data.features[0].geometry.coordinates;
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error during geocoding:', error);
    throw error;
  }
};

// Example usage
geocode('New York')
  .then((coordinates) => {
    console.log('Coordinates:', coordinates);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

module.exports.index = async (req, res) => {
  const alllist = await Listing.find({});
  res.render("listings/index.ejs", { alllist });
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

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListings = async (req, res, next) => {
  try {
    let coordinates = await geocode(req.body.listing.location);

    let result = ListingSchema.validate(req.body);

    if (result.error) {
      throw new ExpressError(400, result.error);
    }

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = {
      type: "Point",
      coordinates: coordinates
    };

    let savedListing = await newListing.save();

    console.log(savedListing);
    req.flash("success", "New Listing Added! ");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    next(err); // Pass the error to the next middleware or error handler
  }
};

module.exports.destroy = async (req, res) => {
  let { id } = req.params;
  let del = await Listing.findByIdAndDelete(id);
  console.log(del);
  req.flash("success", "Listing deleted! ");
  res.redirect("/listings");
};
