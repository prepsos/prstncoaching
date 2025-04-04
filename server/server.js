// server/server.js

const dotenv = require("dotenv");
dotenv.config(); // ✅ LOAD THIS FIRST

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ AFTER dotenv.config()

const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

// Serve static files (like your HTML and CSS)
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
            unit_amount: 7500, // $25.00 in cents
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:4242/success.html",
      cancel_url: "http://localhost:4242/coaching.html",
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
