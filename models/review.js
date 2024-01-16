const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        default: "amazing", 
    },
    rating: {
        type: Number,
        default: 0 
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);
