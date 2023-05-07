const mongoose = require('mongoose');

const saeeSchema = mongoose.Schema({
    userprice: Number,
    marketerprice: Number,
    kgprice: Number,
    status: Boolean
})

module.exports = mongoose.model("Saee", saeeSchema);