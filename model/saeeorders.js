const mongoose = require("mongoose");

const saeeOrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    ordernumber: String,
    data: Object,
    paytype: String,
    price: Number,
    codPrice: Number,
    weight: Number,
    marktercode: {
        type: String,
        default: ''
    },
    createdate: Date,
    created_at: Date,
    inovicedaftra: Object,
    supplier_inovicedaftra: Object,
    status: {
        type: String,
        enum: ['failed', 'pending', 'accepted', 'canceled'],
        default: 'pending'
    },
    cancelReason: String,
    sender: Object,
    receiver: Object,
})

module.exports = mongoose.model("SaeeOrder", saeeOrderSchema);