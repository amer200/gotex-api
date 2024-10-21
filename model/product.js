const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0.01,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    images: [{
        type: String,
        trim: true,
    }],
    stock: {
        type: Number,
        min: 0,
    },
    ratings: {
        type: Number,
        min: 1,
        max: 5,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
},
    { versionKey: false }, { strict: false });

productSchema.index({ name: 'text' });
productSchema.index({ price: 1 });
module.exports = mongoose.model('Product', productSchema);

