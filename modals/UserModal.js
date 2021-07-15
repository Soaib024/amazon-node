const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
  },
  products: {
    type:String,
    default: "[]"
  },
  productCounts: {
    type: String,
    default: "[]"
  },
  totalPrice: {
    type: Number,
    default: 0
  },

  orders: {
    type: [mongoose.Types.ObjectId],
    ref: "Order",
    default: []
  }
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function(unHashedPassword, hashedPassword){
  return await bcrypt.compare(unHashedPassword, hashedPassword);
}

UserSchema.methods.insertIntoOrders = async function(orderId){
  this.orders.push(orderId)
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
