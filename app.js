const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("./database");
dotenv.config({ path: "./.env" });
const Product = require("./modals/ProductModal");
let results = [];

const caching = async () => {
  setInterval(async () => {
    let products = await Product.find();
    temp = [];
    for (let i = 0; i < 27; i++) {
      temp.push(products[Math.ceil(Math.random() * products.length - 1)]);
    }
    results = temp;
  }, 3 * 60 * 1000);
};

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.options("*", cors());

const webhookRoutes = require("./routes/webhook");
app.use("/webhook", webhookRoutes);

app.use(express.json());
app.use(cookieParser());

const userRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const { protected } = require("./controllers/auth");
const checkoutRoutes = require("./routes/checkout");
const ordersRoutes = require("./routes/orders");
const productsRoutes = require("./routes/products");

app.use("/api/users", userRoutes);
app.use("/api/cart", protected, cartRoutes);
app.use("/api/checkout", protected, checkoutRoutes);
app.use("/api/orders", protected, ordersRoutes);
app.use("/api/products",(req, res, next) => {
    if (results.length == 27) {
      req.data = results;
    }
    next();
  },
  productsRoutes
);

app.listen(port, () => {
  caching();
  console.log(`Running at port ${port}`);
});
