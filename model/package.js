const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
    price: Number,
    numberOfOrders: Number
})
module.exports = mongoose.model("Package", packageSchema);