// server/server.js

const dotenv = require("dotenv");
dotenv.config(); // ✅ Load .env first

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");
const app = express();

const PORT = process.env.PORT || 4242;

// Serve frontend files
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

// Stripe checkout endpoint
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Trial Coaching Session",
            },
            unit_amount: 300, // $75 in cents
          },
          quantity: 1,
        },
      ],
      success_url: "https://www.prstncoaching.shop/success.html",  // ✅ LIVE DOMAIN
      cancel_url: "https://www.prstncoaching.shop/coaching.html",  // ✅ LIVE DOMAIN
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).send("Something went wrong");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
