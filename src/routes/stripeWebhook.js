const express = require("express");
const Stripe = require("stripe");
const User = require("../Models/users");

const paymentRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ RAW BODY REQUIRED
paymentRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
   console.log("🔔 Webhook hit");

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ PAYMENT SUCCESS
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata.userId;
      console.log(`💰 Payment successful for user ID: ${userId}`);
      await User.findByIdAndUpdate(userId, {
        isPremium: true,
      });
    }

    res.json({ received: true });
  }
);

module.exports = paymentRouter;
