import userModel from '../models/userModel.js';

// add products to cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, {cartData});
        return res.json({success:true, message: 'Added to cart successfully'});
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message});
    }
}


// update user cart
const updateCart = async (req, res) => {
    try{
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, {cartData});
    return res.json({success:true, message: 'Cart updated successfully'});
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message});
    }
}


// get user cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.json({success:true, cartData: {}});
        }
        
        let cartData = userData.cartData || {};

        return res.json({success:true, cartData});
    } catch (error) {
        console.log(error)
        return res.json({success:false, message: error.message});
    }
}

export { addToCart, updateCart, getUserCart }