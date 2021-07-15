const express = require("express");
const dotenv = require("dotenv");
const Order = require("../modals/OrderModal");

dotenv.config({ path: "../.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

const endpointSecret = "whsec_GgBE0lluak8DxJamIBhsvbJqfGHb4qcI";

const fulfillOrder = async (session) => {
 
  const orderInfo = {
    payment_status: session.payment_status,
    shipping_address: JSON.stringify(session.shipping.address),
    name: session.shipping.name,
  };

  const order = await Order.findOneAndUpdate({sessionId: session.id}, orderInfo)

  //console.log("Fulfilling order", order);
};

router.post("/",express.raw({ type: "application/json" }),(req, res) => {
    const payload = req.body;
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.log(err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      fulfillOrder(session);
    }
    res.status(200);
  }
);

module.exports = router;
