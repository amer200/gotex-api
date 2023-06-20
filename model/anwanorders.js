const mongoose = require("mongoose");

const anwanOrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    ordernumber: Number,
    data: Object,
    paytype: String,
    price: Number
})

module.exports = mongoose.model("AnwanOrder", anwanOrderSchema);