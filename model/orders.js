const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    ordernumber: String,
    data: Object,
    paytype: String,
    price: Number,
    marktercode: {
        type: String,
        default: ''
    },
    billCode: String,
    createdate: Date,
    created_at: Date,
    inovicedaftra: Object,
    supplier_inovicedaftra: Object,
    status: {
        type: String,
        enum: ['failed', 'pending', 'accepted', 'canceled'],
        default: 'pending'
    }
})

module.exports = mongoose.model("Order", orderSchema);