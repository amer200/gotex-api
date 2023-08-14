const mongoose = require("mongoose");

const splOrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    ordernumber: Number,
    data: Object,
    reciver: Object,
    sender: Object,
    paytype: String,
    price: Number,
    marktercode: String,
    createdate: String
})

module.exports = mongoose.model("splOrder", splOrderSchema);