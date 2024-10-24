const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
}, { timestamps: true, }, { versionKey: false }, { strict: false });

module.exports = mongoose.model('Category', categorySchema);