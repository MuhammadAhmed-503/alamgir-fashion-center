/* eslint-disable no-undef */
import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
    try {
        // Check for token in Authorization header or token header
        const token = req.headers.authorization || req.headers.token;
        
        if (!token) {
            return res.json({ success: false, message: "Unauthorized access - No token provided" });
        }
        
        console.log('Received token:', token);
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Unauthorized access - Invalid token" });
        }
        
        next();
    } catch (error) {
        console.log('Auth error:', error);
        res.json({ success: false, message: "Unauthorized access - Token verification failed" });
    }
}

export default adminAuth;