const mongoose = require("mongoose");

const gltOrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    ordernumber: Number,
    data: Object,
    paytype: String
})

module.exports = mongoose.model("GltOrder", gltOrderSchema);