import express from 'express';
import { registerUser, loginUser, adminLogin, getUserProfile, updateUserProfile, updateUserAvatar } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/update', authUser, updateUserProfile);
userRouter.post('/avatar', authUser, upload.single('image'), updateUserAvatar);

export default userRouter;