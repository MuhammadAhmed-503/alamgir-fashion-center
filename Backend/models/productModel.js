import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    userName: {type: String, required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: Array, required: true},
    category: {type: String, required: true},
    subCategory: {type: String, required: true},
    sizes: {type: Array, required: true},
    colors: {type: Array, default: []}, // Array of color objects: [{name: 'Red', hex: '#FF0000'}]
    bestSeller: {type: Boolean},
    date: {type: Number, required: true},
    reviews: [reviewSchema], // Array of reviews
    averageRating: {type: Number, default: 0}, // Calculated average rating
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const productModel = mongoose.models.product || mongoose.model("Product", productSchema);
export default productModel;