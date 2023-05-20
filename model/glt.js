const mongoose = require('mongoose');

const gltSchema = mongoose.Schema({
    userprice: Number,
    marketerprice: Number,
    kgprice: Number,
    status: Boolean
})

module.exports = mongoose.model("Glt", gltSchema);