const mongoose = require("mongoose");

const smsaOrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    ordernumber: Number,
    data: Object,
    paytype: String,
    price: Number,
    marktercode: String,
    createdate: String,
    inovicedaftra: Object,
    status: {
        type: String,
        enum: ['failed', 'pending', 'accepted', 'canceled'],
        default: 'pending'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("smsaOrder", smsaOrderSchema);