import React from "react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useTheme } from "../context/ThemeContext";
import RelatedProducts from "../components/RelatedProducts";
import { toast } from "react-toastify";
import axios from "axios";

const Product = () => {
  const { ProductId } = useParams();
  const { products, currency, addToCart, token, backendUrl, navigate } = useContext(ShopContext);
  const { isDarkMode } = useTheme();
  const [productsData, setProductsData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchProductsData = async () => {
    products.map((item) => {
      if (item._id === ProductId) {
        setProductsData(item);
        setImage(item.image[0]);
        setReviews(item.reviews || []);
        setAverageRating(item.averageRating || 0);
        return null;
      }
    });
  };
  
  const fetchReviews = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/review/get', { productId: ProductId });
      if (response.data.success) {
        setReviews(response.data.reviews || []);
        setAverageRating(response.data.averageRating || 0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Please login to submit a review");
      navigate('/login');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await axios.post(
        backendUrl + '/api/review/add',
        {
          productId: ProductId,
          rating: newReview.rating,
          comment: newReview.comment,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setReviews(response.data.reviews);
        setAverageRating(response.data.averageRating);
        setNewReview({ rating: 5, comment: "" });
        fetchReviews();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  useEffect(() => {
    fetchProductsData();
    fetchReviews();
    setSize("");
    setColor("");
    // Scroll to top when product page opens
    window.scrollTo({ top: 0, behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ProductId, products]);

  const handleAddToCart = () => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    if (productsData.colors && productsData.colors.length > 0 && !color) {
      toast.error("Please select a color");
      return;
    }
    addToCart(productsData._id, size, color);
  };

  return productsData ? (
    <div className={`pt-10 transition-opacity ease-in duration-500 opacity-100`}>
      {/* Product Data */}
      <div className="flex gap-8 lg:gap-12 flex-col lg:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-4 lg:flex-row">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto justify-start gap-3 lg:w-24 w-full">
            {productsData.image.map((item, index) => (
              <img
                src={item}
                key={index}
                alt="product thumbnail"
                className={`w-20 h-20 lg:w-full lg:h-auto object-cover rounded-xl cursor-pointer transition-all duration-300 ${image === item ? 'ring-2 ring-sky-500 ring-offset-2' : `${isDarkMode ? 'opacity-60 hover:opacity-100' : 'opacity-70 hover:opacity-100'}`}`}
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full lg:flex-1">
            <div className={`rounded-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <img src={image} alt="product" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="flex-1 lg:max-w-md">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${isDarkMode ? 'bg-sky-500/20 text-sky-400' : 'bg-sky-100 text-sky-600'}`}>
            {productsData.category} / {productsData.subCategory}
          </div>
          
          <h1 className={`text-2xl lg:text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            {productsData.name}
          </h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= Math.round(averageRating) ? "#f59e0b" : "#e5e7eb"} className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {averageRating > 0 ? `${averageRating.toFixed(1)} (${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})` : 'No reviews yet'}
            </span>
          </div>
          
          {/* Price */}
          <p className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-cyan-600 bg-clip-text text-transparent mb-6">
            {currency}{productsData.price}
          </p>
          
          <p className={`text-sm leading-relaxed mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {productsData.description}
          </p>
          
          {/* Color Selection */}
          {productsData.colors && productsData.colors.length > 0 && (
            <div className="mb-6">
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Select Color: {color && <span className="text-sky-500">{color}</span>}
              </p>
              <div className="flex gap-3 flex-wrap">
                {productsData.colors.map((colorItem, index) => (
                  <button
                    key={index}
                    onClick={() => setColor(colorItem.name)}
                    className={`color-swatch ${color === colorItem.name ? 'selected' : ''}`}
                    style={{ backgroundColor: colorItem.hex }}
                    title={colorItem.name}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Size Selection */}
          <div className="mb-8">
            <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Select Size: {size && <span className="text-sky-500">{size}</span>}
            </p>
            <div className="flex gap-2 flex-wrap">
              {productsData.sizes.map((item, index) => (
                <button 
                  onClick={() => setSize(item)} 
                  className={`min-w-12 h-12 rounded-xl font-medium transition-all duration-300 ${
                    item === size 
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/30' 
                      : `${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`
                  }`} 
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart} 
            className="w-full py-4 px-8 bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            ADD TO CART
          </button>
          
          {/* Product Features */}
          <div className={`mt-8 p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>100% Original Product</span>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Cash on Delivery Available</span>
              </div>
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Easy Return & Exchange Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description & Reviews Section */}
      <div className="mt-16">
        <div className="flex gap-2">
          <button 
            className={`px-6 py-3 rounded-t-xl font-medium transition-all ${activeTab === 'description' 
              ? `${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'}` 
              : `${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`px-6 py-3 rounded-t-xl font-medium transition-all ${activeTab === 'reviews' 
              ? `${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'}` 
              : `${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
        </div>
        
        <div className={`p-6 rounded-xl rounded-tl-none ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          {activeTab === 'description' ? (
            <div className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <p className="mb-4">{productsData.description}</p>
              <p>
                This premium product is crafted with attention to detail and quality materials. 
                Our commitment to excellence ensures that you receive a product that not only 
                meets but exceeds your expectations. Perfect for any occasion, this versatile 
                piece will become a staple in your wardrobe.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add Review Form */}
              {token ? (
                <form onSubmit={handleSubmitReview} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                  <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Write a Review
                  </h4>
                  
                  {/* Star Rating */}
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="transition-transform hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={star <= newReview.rating ? "#f59e0b" : "#e5e7eb"}
                            className="w-8 h-8 cursor-pointer"
                          >
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      rows="4"
                      placeholder="Share your thoughts about this product..."
                      className={`w-full px-4 py-3 rounded-xl ${
                        isDarkMode
                          ? 'bg-slate-600 text-white border-slate-500'
                          : 'bg-slate-50 text-slate-800 border-slate-200'
                      } border focus:outline-none focus:ring-2 focus:ring-sky-500`}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className={`p-6 rounded-xl text-center ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                  <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Please login to write a review
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-300"
                  >
                    Login to Review
                  </button>
                </div>
              )}

              {/* Display Reviews */}
              <div className="space-y-4">
                <h4 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Customer Reviews
                </h4>
                
                {reviews.length === 0 ? (
                  <div className={`p-8 rounded-xl text-center ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                ) : (
                  reviews.slice().reverse().map((review, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            {review.userName}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={star <= review.rating ? "#f59e0b" : "#e5e7eb"}
                                className="w-4 h-4"
                              >
                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {productsData && <RelatedProducts category={productsData.category} subCategory={productsData.subCategory} />}
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-teal-600"></div>
        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Loading...</p>
      </div>
    </div>
  );
};

export default Product;
