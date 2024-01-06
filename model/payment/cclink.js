const mongoose = require("mongoose");

const cclinkSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Clint' },
    amount: Number,
    url: String,
    tapid: String,
    status: {
        type: String,
        default: "pending"
    },
})
module.exports = mongoose.model("cclink", cclinkSchema);