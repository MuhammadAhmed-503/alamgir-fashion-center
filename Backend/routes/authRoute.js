import express from 'express';
import passport from '../config/passport.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import userModel from '../models/userModel.js';

const authRouter = express.Router();

// Helper function to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Helper function to generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Frontend URL for redirects
const getFrontendURL = () => process.env.FRONTEND_URL || 'http://localhost:5173';

// Create email transporter
const createEmailTransporter = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
        from: `"Alamgir Fashion Center" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code - Alamgir Fashion Center',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #4F46E5; margin: 0;">Alamgir Fashion Center</h1>
                </div>
                <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px; border-radius: 16px; text-align: center;">
                    <h2 style="color: white; margin: 0 0 10px 0;">Verification Code</h2>
                    <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0;">Use this code to verify your account</p>
                    <div style="background: white; padding: 20px; border-radius: 12px; display: inline-block;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${otp}</span>
                    </div>
                    <p style="color: rgba(255,255,255,0.8); margin: 20px 0 0 0; font-size: 14px;">This code expires in 10 minutes</p>
                </div>
                <div style="text-align: center; margin-top: 30px; color: #666;">
                    <p style="margin: 0;">If you didn't request this code, please ignore this email.</p>
                    <p style="margin: 10px 0 0 0; font-size: 12px;">© ${new Date().getFullYear()} Alamgir Fashion Center. All rights reserved.</p>
                </div>
            </div>
        `
    };
    
    return transporter.sendMail(mailOptions);
};

// ============================================
// GOOGLE OAUTH ROUTES
// ============================================
authRouter.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${getFrontendURL()}/login?error=google_auth_failed` }),
    (req, res) => {
        const token = createToken(req.user._id);
        res.redirect(`${getFrontendURL()}/auth/callback?token=${token}&provider=google`);
    }
);

// ============================================
// GITHUB OAUTH ROUTES
// ============================================
authRouter.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

authRouter.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${getFrontendURL()}/login?error=github_auth_failed` }),
    (req, res) => {
        const token = createToken(req.user._id);
        res.redirect(`${getFrontendURL()}/auth/callback?token=${token}&provider=github`);
    }
);

// ============================================
// FACEBOOK OAUTH ROUTES
// ============================================
authRouter.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

authRouter.get('/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: `${getFrontendURL()}/login?error=facebook_auth_failed` }),
    (req, res) => {
        const token = createToken(req.user._id);
        res.redirect(`${getFrontendURL()}/auth/callback?token=${token}&provider=facebook`);
    }
);

// ============================================
// PHONE NUMBER AUTHENTICATION
// ============================================

// Send OTP to email (for phone-based login flow)
authRouter.post('/phone/send-otp', async (req, res) => {
    try {
        const { phone, countryCode, email } = req.body;
        
        if (!email) {
            return res.json({ success: false, message: 'Email is required to receive OTP' });
        }

        const fullPhone = phone ? `${countryCode || '+1'}${phone.replace(/\D/g, '')}` : null;
        
        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Find or create user with email/phone
        let user = await userModel.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            // Create temporary user record
            user = new userModel({
                phone: fullPhone,
                name: 'New User',
                email: email.toLowerCase(),
                phoneOTP: otp,
                phoneOTPExpires: otpExpires,
                authProvider: 'phone'
            });
        } else {
            user.phoneOTP = otp;
            user.phoneOTPExpires = otpExpires;
            if (fullPhone) user.phone = fullPhone;
        }
        
        await user.save();

        // Send OTP via email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await sendOTPEmail(email, otp);
                console.log(`OTP sent to email: ${email}`);
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // In development, still return success with OTP in console
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
                } else {
                    return res.json({ success: false, message: 'Failed to send OTP email. Please try again.' });
                }
            }
        } else {
            // Development mode - log OTP to console
            console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
        }

        res.json({ 
            success: true, 
            message: 'OTP sent to your email',
            // Only include OTP in response during development
            ...(process.env.NODE_ENV === 'development' && { devOTP: otp })
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
});

// Verify OTP and login
authRouter.post('/phone/verify-otp', async (req, res) => {
    try {
        const { phone, countryCode, otp, name, email } = req.body;
        
        if (!email || !otp) {
            return res.json({ success: false, message: 'Email and OTP are required' });
        }
        
        const user = await userModel.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.json({ success: false, message: 'Email not found. Please request OTP first.' });
        }

        // Check if OTP is valid
        if (user.phoneOTP !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        // Check if OTP is expired
        if (user.phoneOTPExpires < new Date()) {
            return res.json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        // Mark phone as verified and clear OTP
        user.isPhoneVerified = true;
        user.phoneOTP = undefined;
        user.phoneOTPExpires = undefined;
        
        // Update name if provided (for new users)
        if (name && user.name === 'New User') {
            user.name = name;
        }

        // Update phone if provided
        if (phone) {
            user.phone = `${countryCode || '+1'}${phone.replace(/\D/g, '')}`;
        }
        
        await user.save();

        const token = createToken(user._id);

        res.json({ 
            success: true, 
            message: 'Verified successfully',
            token,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
});

// ============================================
// GET USER PROFILE
// ============================================
authRouter.get('/me', async (req, res) => {
    try {
        const token = req.headers.token;
        
        if (!token) {
            return res.json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password -phoneOTP -phoneOTPExpires');
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ 
            success: true, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                authProvider: user.authProvider
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
});

export default authRouter;
