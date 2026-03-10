import express from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, addReview);
reviewRouter.post('/get', getProductReviews);

export default reviewRouter;
