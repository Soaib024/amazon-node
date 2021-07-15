const mongoose = require("mongoose");

const OrderModal = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    sessionId: String,
    amount: Number,
    amount_shipping: Number,
    payment_status: String,
    shipping_address: String,
    name: String,

    products: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderModal);
module.exports = Order;
