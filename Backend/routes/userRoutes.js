import express from 'express';
import { registerUser, loginUser, adminLogin, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/update', authUser, updateUserProfile);

export default userRouter;