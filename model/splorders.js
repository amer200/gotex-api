const mongoose = require("mongoose");

const splOrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    ordernumber: String,
    data: Object,
    reciver: Object,
    sender: Object,
    paytype: String,
    price: Number,
    marktercode: String,
    createdate: Date,
    created_at: Date,
    inovicedaftra: Object,
    weight: Number,
    desc: String,
    status: {
        type: String,
        enum: ['failed', 'pending', 'accepted', 'canceled'],
        default: 'pending'
    }
})

module.exports = mongoose.model("splOrder", splOrderSchema);