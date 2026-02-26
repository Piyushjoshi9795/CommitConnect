const express = require("express");
const Stripe = require("stripe");
const { adminAuth } = require("../middlewares/adminauth");

const paymentRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE PAYMENT INTENT
paymentRouter.post(
  "/create-payment-intent",
  adminAuth, // 🔐 user must be logged in
  async (req, res) => {
    try {
      const { amount } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // paise
        currency: "inr",
        metadata: {
          userId: req.user._id.toString(), // 🔥 VERY IMPORTANT
        },
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
);

module.exports = paymentRouter;
