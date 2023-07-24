const mongoose = require("mongoose");

const clintSchema = mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    city: String,
    address: String,
    wallet: {
        type: Number,
        default: 0
    },
    receipts: [String],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orders: [
        {
            company: String,
            id: String
        }
    ]
})
module.exports = mongoose.model("Clint", clintSchema);