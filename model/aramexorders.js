const mongoose = require("mongoose");

const aramexOrderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    ordernumber: Number,
    data: Object
})

module.exports = mongoose.model("aramexOrder", aramexOrderSchema);