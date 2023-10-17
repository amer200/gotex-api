const mongoose = require("mongoose");

const clintSchema = mongoose.Schema({
    name: String,
    company: String,
    email: String,
    mobile: String,
    city: String,
    address: String,
    notes: String,
    street: String,
    wallet: {
        type: Number,
        default: 0
    },
    category: String,
    addby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orders: [
        {
            company: String,
            id: String,
            markter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ],
    daftraClientId: String,
    credit: {
        status: String,
        limet: Number,
        addby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
})
module.exports = mongoose.model("Clint", clintSchema);