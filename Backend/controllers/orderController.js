import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

//global variables
const currency = 'inr';
const deliveryCharge = 10;

//get stripe key from env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Placing orders using COD Method
const PlaceOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{ cartData: {} });
        res.json({ success: true, message: 'Order placed successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//Placing orders using Stripe Method
const PlaceOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: true,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const lineItems = items.map(item => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));


        lineItems.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Total Amount',
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items: lineItems,
            mode: 'payment',
        });

        res.json({ success: true, url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

//Verify Stripe Payment
const verifyStripe = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId,{ cartData: {} });
            res.json({ success: true, message: 'Payment Successful and Order Placed' });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: 'Payment Failed, Order Cancelled' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//Placing orders using Razorpay Method
const PlaceOrderRazorpay = async (req, res) => {

}

//All Orders for admin
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//User order data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//update order status by admin
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { PlaceOrder, PlaceOrderStripe, verifyStripe, PlaceOrderRazorpay, allOrders, userOrders, updateStatus };
