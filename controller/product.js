const Product = require('../model/product');

// Create a new product
const createProduct = async (req, res) => {
    const { name, createdBy, description, price, stock, category } = req.body;
    var images = [];
    if (req.files) {
        req.files.forEach((f) => {
            images.push(f.path);
        });
    }

    try {
        const newProduct = new Product({
            name,
            createdBy,
            description,
            price,
            stock,
            category,
            images
        });

        const savedProduct = await newProduct.save();
        return res.status(201).json(savedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ category: categoryId }).populate("category");
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getProductsByName = async (req, res) => {
    try {
        const { query } = req.params;
        const products = await Product.find({ $text: { $search: query } }).populate("category");
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Get a single product by ID
const getProductById = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Update an existing product
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, stock, category } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, description, price, stock, category },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Delete a product by ID
const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getProductById,
    getProducts,
    getProductsByCategory,
    getProductsByName

};