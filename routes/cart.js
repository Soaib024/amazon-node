const express = require("express");
const User = require("../modals/UserModal");

const router = express.Router();

router.post("/", async (req, res) => {
  const newUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      products: req.body.products,
      productCounts: req.body.productCounts,
      totalPrice: req.body.totalPrice,
    },
    { new: true }
  );
  res.status(204).json({
    status: "success"
  });
});

router.get("/", (req, res) => {
  const id = req.user._id;
  res.status(200).json({
    status: "success",
    products: req.user.products,
    productCounts: req.user.productCounts,
    totalPrice: req.user.totalPrice,
  });
});

module.exports = router;
