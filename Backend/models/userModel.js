import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: false}, // Not required for OAuth users
    cartData: {type: Object, default: {}},
    
    // OAuth provider IDs
    googleId: {type: String, unique: true, sparse: true},
    githubId: {type: String, unique: true, sparse: true},
    facebookId: {type: String, unique: true, sparse: true},
    
    // Phone authentication
    phone: {type: String, unique: true, sparse: true},
    phoneOTP: {type: String},
    phoneOTPExpires: {type: Date},
    isPhoneVerified: {type: Boolean, default: false},
    
    // Profile info from OAuth
    avatar: {type: String},
    authProvider: {type: String, enum: ['local', 'google', 'github', 'facebook', 'phone'], default: 'local'}
},{minimize: false, timestamps: true});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;