const express = require("express");
const Order = require("../modals/OrderModal");
const router = express.Router();
const loremIpsum = require("lorem-ipsum").loremIpsum;

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const lorem = () => {
  return `${loremIpsum()} \n ${loremIpsum()}`
}
router.post("/", async (req, res) => {
  const user = req.user;
  const products = req.body.products;
  const productCounts = req.body.productCounts;

  const transformedProducts = products.map((product, index) => ({
    description: lorem(),
    quantity: productCounts[index] * 1,
    price_data: {
      currency: "inr",
      product_data: {
        name: product.title,
        images: [product.image],
      },
      unit_amount: product.price * 100,
    },
  }));
  

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_rates: ["shr_1IzE3ASB6xVY9FmUnXNaS9lP"],
    shipping_address_collection: {
      allowed_countries: ["IN"],
    },
    line_items: transformedProducts,
    mode: "payment",
    success_url: `https://amazon0123.herokuapp.com/success`,
    cancel_url: `https://amazon0123.herokuapp.com/checkout`,
    metadata: {
      email: user.email,
      
    },
  });


  const order = await Order.create({
    userId: user._id,
    sessionId: session.id,
    amount: session.amount_total / 100,
    amount_shipping: session.total_details.amount_shipping / 100,
    payment_status: session.payment_status,
    products: JSON.stringify(transformedProducts),
  });

  user.insertIntoOrders(order._id);
  user.save();

  res.status(200).json({ id: session.id });
});

module.exports = router;
