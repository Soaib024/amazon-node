const express = require("express");
const Order = require("../modals/OrderModal");
const APIFilters = require("../utils/APIFilters");
const router = express.Router();

router.get("/", async (req, res) => {
  let orders = Order.find({ _id: { $in: req.user.orders } });
  orders = new APIFilters(orders, req.query).sort().paginate();

  orders = await orders.query;

  res.status(200).json({
    status: "success",
    orders: orders,
  });
});

module.exports = router;
