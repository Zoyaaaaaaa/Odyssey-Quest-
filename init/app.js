const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/travel";

main()
.then(()=>{
console.log("MongoDb is successfully connected");
})
.catch((err)=>{
console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
// const initDB=async()=>{
//   await Listing.deleteMany({});
//  initData.data= initData.data.map((obj)=>({...obj,owner:"654baafbcd467d28a3454c6c",}));
//   await Listing.insertMany(initData.data);
//   console.log("Data was initialized");
// };

// initDB();
// const mongoose = require('mongoose');
// const Listing = require('../models/listing'); // Adjust the path as per your project structure

// async function createListingManually() {
//   try {
//     const newListing = new Listing({
//       title: "Safari Lodge in the Serengeti",
//       description: "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
//       image: {
//         filename: "listingimage",
//         url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//       },
//       price: 4000,
//       location: "Serengeti National Park",
//       country: "Tanzania",
//       category: "countryside",
//       owner: "6679578a7275292cc41ffdba", // Use new keyword here
//     });

//     let savedListing = await newListing.save();
//     console.log("New listing saved:", savedListing);
//   } catch (err) {
//     console.error("Error saving listing:", err);
//   }
// }

// createListingManually();
async function saveListing() {
  try {
    // Example listing data
    const newListing = new Listing({
      title: "Safari Lodge in the Serengeti",
      description: "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
      image: {
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      },
      price: 4000,
      location: "Serengeti National Park",
      country: "Tanzania",
      category: "mountains", // Example category
      owner: "6679578a7275292cc41ffdba", // Replace with an actual user ID
      geometry: {
        type: "Point",
        coordinates: [34.831,-2.155], // Example coordinates
      },
    });

    let savedListing = await newListing.save();
    console.log("New listing saved:", savedListing);
  } catch (err) {
    console.error("Error saving listing:", err);
  }
}

saveListing();

