const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
const { plans, annualPlans } = require("../utils/constant");

const stripeSecret = process.env.STRIPE_SECRET;
console.log(stripeSecret);
const stripe = require("stripe")(stripeSecret);

// Get transactions for a specific user
exports.paymentIntent = async (req, res) => {
  const { sub } = req.body;

  const currentPlans = sub.time === "Monthly" ? plans : annualPlans;

  const currentPlan = currentPlans.find((plan) => plan.planName === sub?.type);
  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: currentPlan.actualPrice * 100,
      currency: "usd",
      metadata: {
        userId: req.user.id,
        type: sub.type,
        time: sub.time,
      },
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating intent", error);
    res.status(500).json({ error: "Error creating intent" });
  }
};

const subscription = {
  Monthly: [...plans],
  Yearly: [...annualPlans],
};

exports.webHook = async (req, res) => {
  try {
    let event = req.body;
    if (process.env.STRIPE_ENDPOINT_SECRET) {
      const signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          process.env.STRIPE_ENDPOINT_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );

        // Extract metadata from the paymentIntent
        const userId = paymentIntent.metadata.userId;
        const planType = paymentIntent.metadata.type; // e.g., 'Basic'
        const planTime = paymentIntent.metadata.time; // e.g., 'Monthly'

        // Update user subscription, emailCredit, and phoneCredit
        await handlePaymentIntentSucceeded(
          userId,
          planType,
          planTime,
          paymentIntent
        );

        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        console.log(paymentMethod);
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    res.send(); // Acknowledge receipt of the event
  } catch (error) {
    console.error("Error stripe hook", error);
    res.status(500).json({ error: "Error stripe hook" });
  }
};

// Function to update user subscription and credits
async function handlePaymentIntentSucceeded(
  userId,
  planType,
  planTime,
  paymentIntent
) {
  try {
    console.log(userId, planType, planTime, paymentIntent);
    // Find the correct plan details based on the type and time
    const planDetails = subscription[planTime].find(
      (plan) => plan.planName === planType
    );

    if (!planDetails) {
      console.error(`Plan not found for type: ${planType}, time: ${planTime}`);
      return;
    }

    // Update user's subscription and credits
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User not found with ID: ${userId}`);
      return;
    }

    user.subscription.type = planType;
    user.subscription.time = planTime;
    user.emailCredit = planDetails.emailCredits;
    user.phoneCredit = planDetails.mobileCredits;
    await user.save();

    // Record the transaction
    const transaction = new Transaction({
      userId: userId,
      amount: paymentIntent.amount_received / 100, // Convert from cents to dollars
      providerId: paymentIntent.id,
      status: "Completed",
      type: "Deposit",
    });

    await transaction.save();

    console.log(`User updated and transaction recorded for user ID: ${userId}`);
  } catch (error) {
    console.error("Error updating user and recording transaction:", error);
  }
}

exports.retrivePayment = async (req, res) => {
  const { paymentIntentId } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json(paymentIntent);
  } catch (error) {
    console.error("Error fetching payment intent:", error);
    res.status(500).json({ message: "Error fetching payment details" });
  }
};
