import {v2 as cloudinary} from 'cloudinary';
import productMOdel from '../models/productModel.js';

// function for add product
const addProduct = async (req, res) => {

    try {
        console.log('Adding product, received body:', req.body);
        console.log('Files received:', req.files);

        const { name, description, price, category, subCategory, sizes, colors, bestSeller } = req.body;

        // Handle image files
        const image1 = req.files && req.files.image1 && req.files.image1[0]
        const image2 = req.files && req.files.image2 && req.files.image2[0]
        const image3 = req.files && req.files.image3 && req.files.image3[0]
        const image4 = req.files && req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type: "image"});
                return result.secure_url;
            }
        ));

        // console.log(name, description, price, category, subCategory, sizes, bestSeller);
        // console.log(imageUrl);

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestSeller: bestSeller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            colors: colors ? JSON.parse(colors) : [],
            image: imageUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productMOdel(productData);
        await product.save();
        
        res.json({success: true, message: 'Product added successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// function for get list product (sorted by newest first)
const listProduct = async (req, res) => {
    try {
        const products = await productMOdel.find({}).sort({createdAt: -1, date: -1});
        res.json({success: true, products});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// function for get single product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productMOdel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// function for removing product
const removeProduct = async (req, res) => {
    try {
        await productMOdel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: 'Product removed successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for updating product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, colors, bestSeller, existingImages } = req.body;

        console.log('Updating product:', id);
        console.log('Request body:', req.body);

        // Handle new image files if any
        const image1 = req.files && req.files.image1 && req.files.image1[0]
        const image2 = req.files && req.files.image2 && req.files.image2[0]
        const image3 = req.files && req.files.image3 && req.files.image3[0]
        const image4 = req.files && req.files.image4 && req.files.image4[0]

        // Parse existing images
        let existingImagesArray = [];
        try {
            existingImagesArray = existingImages ? JSON.parse(existingImages) : [];
        } catch (e) {
            existingImagesArray = [];
        }

        // Build final images array - replace at specific positions if new image uploaded
        let finalImages = [...existingImagesArray];
        
        const newImageFiles = [
            { file: image1, index: 0 },
            { file: image2, index: 1 },
            { file: image3, index: 2 },
            { file: image4, index: 3 }
        ];

        for (const { file, index } of newImageFiles) {
            if (file) {
                const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
                finalImages[index] = result.secure_url;
            }
        }

        // Filter out undefined/null entries but keep the order
        finalImages = finalImages.filter(img => img);

        const updateData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestSeller: bestSeller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            colors: colors ? JSON.parse(colors) : [],
        };

        // Only update images if we have any
        if (finalImages.length > 0) {
            updateData.image = finalImages;
        }

        const product = await productMOdel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }
        
        res.json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, listProduct, singleProduct, removeProduct, updateProduct };