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
    },
    order: {
        for: {
            type: String,
            enum: ['user', 'client'],
            default: 'user'
        },
        client: { type: mongoose.Schema.Types.ObjectId, ref: 'Clint' },
        payedFrom: {
            type: String,
            enum: ['user-wallet', 'user-package', 'client-package', 'client-wallet', 'client-credit'],
            default: 'user-wallet'
        }
    },
    cancelReason: String,
    cancel: {
        request: {
            type: Boolean,
            default: false
        },
        requestStatus: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    }
})

module.exports = mongoose.model("Order", orderSchema);