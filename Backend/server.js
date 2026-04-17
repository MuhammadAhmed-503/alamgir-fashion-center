import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import passport from 'passport';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import './config/passport.js'; // Initialize passport strategies
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import authRouter from './routes/authRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import settingsRouter from './routes/settingsRoute.js';
import categoryRouter from './routes/categoryRoute.js';

// connect to cloudinary
connectCloudinary();

// connect to the database
connectDB();

// app configuration
const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',') : [])
].filter(Boolean);


// middlewares
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error('CORS policy blocked this origin'));
    },
    credentials: true
}));
app.use(express.json());

// Initialize passport (no sessions for JWT-based auth)
app.use(passport.initialize());

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/auth', authRouter);
app.use('/api/review', reviewRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/category', categoryRouter);

// test endpoint
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Backend is live' });
});

// Local development listener only. Vercel invokes the exported app as a serverless function.
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Admin login endpoint: http://localhost:${PORT}/api/user/admin`);
        console.log(`Product endpoints: http://localhost:${PORT}/api/product/*`);
    });
}

export default app;
