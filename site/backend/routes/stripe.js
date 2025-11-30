const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: process.env.PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.PUBLIC_URL}/success`,
      cancel_url: `${process.env.PUBLIC_URL}/cancel`,
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Raw body for webhook verification
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
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

  switch (event.type) {
    case 'checkout.session.completed':
      // TODO: record session, append to investor ledger if needed
      break;
    case 'invoice.paid':
      // TODO: record invoice, update evidence or receipts
      break;
    case 'customer.subscription.deleted':
      // TODO: handle cancellations
      break;
    default:
      console.log(`Unhandled event ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
