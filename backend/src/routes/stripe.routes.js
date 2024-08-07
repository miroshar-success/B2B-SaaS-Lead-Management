const express = require("express");
const {
  paymentIntent,
  webHook,
  retrivePayment,
} = require("../controllers/stripe.controller");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/create-payment-intent", auth, paymentIntent);

router.post("/webhook", express.raw({ type: "application/json" }), webHook);
router.get("/payment/:paymentIntentId", auth, retrivePayment);

module.exports = router;
