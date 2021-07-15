const mongoose = require("mongoose");

const ProductModals = new mongoose.Schema({
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

  images: [String],
  productCategoryTree: [String],
  retailPrice: Number,
  productSpecifications: String,
});

const Product2 = mongoose.model("Product2", ProductModals);
module.exports = Product2;
