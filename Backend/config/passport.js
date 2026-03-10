import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import userModel from '../models/userModel.js';

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        scope: ['profile', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with this Google ID
            let user = await userModel.findOne({ googleId: profile.id });
            
            if (user) {
                return done(null, user);
            }
            
            // Check if user exists with same email
            user = await userModel.findOne({ email: profile.emails[0].value });
            
            if (user) {
                // Link Google account to existing user
                user.googleId = profile.id;
                user.avatar = user.avatar || profile.photos[0]?.value;
                await user.save();
                return done(null, user);
            }
            
            // Create new user
            user = await userModel.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0]?.value,
                authProvider: 'google'
            });
            
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with this GitHub ID
            let user = await userModel.findOne({ githubId: profile.id });
            
            if (user) {
                return done(null, user);
            }
            
            // Get email from GitHub (might be in emails array)
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.local`;
            
            // Check if user exists with same email
            user = await userModel.findOne({ email });
            
            if (user) {
                // Link GitHub account to existing user
                user.githubId = profile.id;
                user.avatar = user.avatar || profile.photos[0]?.value;
                await user.save();
                return done(null, user);
            }
            
            // Create new user
            user = await userModel.create({
                githubId: profile.id,
                name: profile.displayName || profile.username,
                email,
                avatar: profile.photos[0]?.value,
                authProvider: 'github'
            });
            
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email', 'photos']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with this Facebook ID
            let user = await userModel.findOne({ facebookId: profile.id });
            
            if (user) {
                return done(null, user);
            }
            
            // Get email from Facebook
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@facebook.local`;
            
            // Check if user exists with same email
            user = await userModel.findOne({ email });
            
            if (user) {
                // Link Facebook account to existing user
                user.facebookId = profile.id;
                user.avatar = user.avatar || profile.photos[0]?.value;
                await user.save();
                return done(null, user);
            }
            
            // Create new user
            user = await userModel.create({
                facebookId: profile.id,
                name: profile.displayName,
                email,
                avatar: profile.photos[0]?.value,
                authProvider: 'facebook'
            });
            
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));
}

export default passport;
