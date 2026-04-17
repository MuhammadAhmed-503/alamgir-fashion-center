import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// Add a review to a product
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.userId || req.body?.userId;

        if (!rating || !comment) {
            return res.json({ success: false, message: "Rating and comment are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const user = await userModel.findById(userId).select('name');
        const resolvedUserName = user?.name || req.body?.userName || 'Anonymous User';

        // Check if user already reviewed this product
        const existingReview = product.reviews.find(
            review => review.user.toString() === userId
        );

        if (existingReview) {
            // Update existing review
            existingReview.rating = rating;
            existingReview.comment = comment;
            existingReview.date = Date.now();
        } else {
            // Add new review
            product.reviews.push({
                user: userId,
                userName: resolvedUserName,
                rating: rating,
                comment: comment
            });
        }

        // Calculate average rating
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.averageRating = totalRating / product.reviews.length;

        await product.save();

        res.json({ 
            success: true, 
            message: existingReview ? "Review updated successfully" : "Review added successfully",
            reviews: product.reviews,
            averageRating: product.averageRating
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await productModel.findById(productId).populate('reviews.user', 'name');

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ 
            success: true, 
            reviews: product.reviews,
            averageRating: product.averageRating
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addReview, getProductReviews };
