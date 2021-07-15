const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  image: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  hasPrime: Boolean,
  price: {
    type: Number,
    min: 0,
  },

  // images: [String],
  // productCategoryTree: [String],
  // retailPrice: Number,
  // productSpecifications: String,
  url: String
});



const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
