const mongoose = require("mongoose");

const gotexOrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    ordernumber: String,
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
    status: {
        type: String,
        enum: ['failed', 'pending', 'accepted', 'canceled'],
        default: 'pending'
    },
    sender: Object,
    receiver: Object,
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

module.exports = mongoose.model("gotexOrder", gotexOrderSchema);