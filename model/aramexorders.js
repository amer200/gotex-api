const mongoose = require("mongoose");

const aramexOrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    ordernumber: Number,
    data: Object,
    paytype: String,
    price: Number,
    marktercode: {
        type: String,
        default: ''
    },
    createdate: Date,
    created_at: Date,
    inovicedaftra: Object,
    status: {
        type: String,
        enum: ['failed', 'pending', 'accepted', 'canceled'],
        default: 'pending'
    }
})

module.exports = mongoose.model("aramexOrder", aramexOrderSchema);