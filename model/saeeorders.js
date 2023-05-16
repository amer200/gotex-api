const mongoose = require("mongoose");

const saeeOrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    data: Object
})

module.exports = mongoose.model("SaeeOrder", saeeOrderSchema);