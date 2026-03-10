import express from 'express';
import { PlaceOrder, userOrders, PlaceOrderStripe, PlaceOrderRazorpay, updateStatus, allOrders, verifyStripe } from '../controllers/orderController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

// Payment Features
orderRouter.post('/place', authUser, PlaceOrder);
orderRouter.post('/stripe', authUser, PlaceOrderStripe);
orderRouter.post('/razorpay', authUser, PlaceOrderRazorpay);

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// User Features
orderRouter.post('/userorders', authUser, userOrders);

//verify Stripe Payment
orderRouter.post('/verify', authUser, verifyStripe);

export default orderRouter;