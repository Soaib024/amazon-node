const Product = require("../modals/ProductModal");
const APIFilters = require("../utils/APIFilters");

const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  let products = new APIFilters(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  products = await products.query;
  res.status(200).json({
    status: "success",
    products,
  });
});

router.get("/home", async (req, res) => {
  if (req.data != undefined) {
    return res.status(200).json({
      status: "success",
      products: req.data,
    });
  }

  console.log(Date.now());
  let products = await Product.find();
  const results = [];

  for (let i = 0; i < 27; i++) {
    results.push(products[Math.ceil(Math.random() * products.length)]);
  }

  return res.status(200).json({
    status: "success",
    products: results,
  });
});

router.get("/search/:pattern", async (req, res) => {
  const pattern = req.params.pattern;

  const searchObj = {
    $or: [
      { title: { $regex: pattern, $options: "i" } },
      { category: { $regex: pattern, $options: "i" } },
    ],
  };

  try {
    const products = new APIFilters(
      Product.find(searchObj),
      req.query
    ).paginate();
    const results = await products.query;
    return res.status(200).json({
      status: "success",
      results: results,
    });
  } catch (e) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: "Something went wrong",
    });
  }
});

router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => res.status(200).json({ status: "success", product }))
    .catch((err) =>
      res.status(400).json({
        status: "error",
        message: "Something went wrong, Please try again later",
      })
    );
});

module.exports = router;
