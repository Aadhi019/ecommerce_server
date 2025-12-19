const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Payment = require('../models/Payment');

const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: 'usd',
      metadata: { orderId: order._id.toString() }
    });

    await Payment.create({
      user: req.user._id,
      order: orderId,
      paymentIntentId: paymentIntent.id,
      amount: order.totalPrice
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const payment = await Payment.findOne({ paymentIntentId });
      const order = await Order.findById(payment.order);
      
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntentId,
        status: paymentIntent.status,
        update_time: new Date().toISOString()
      };
      
      payment.status = 'succeeded';
      
      await Promise.all([order.save(), payment.save()]);
      
      res.json({ message: 'Payment confirmed successfully' });
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent, confirmPayment };