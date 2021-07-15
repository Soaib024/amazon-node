const mongose = require("mongoose");

const CartModal = new mongose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: {
    type: [],
    default: [],
  },
  productCounts: [Number],
  totalPrice: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.modal("Cart", CartModal);
module.exports = Cart;
