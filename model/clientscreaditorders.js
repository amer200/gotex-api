const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    markterid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clientid: Number,
    credit_period: Number,
    credit_limit: Number,
    status: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model("clientcreditorder", orderSchema);