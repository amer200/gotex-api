const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
    price: Number,
    numberOfOrders: Number,
    companies: [String]
})
module.exports = mongoose.model("Package", packageSchema);