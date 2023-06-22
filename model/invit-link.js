const mongoose = require("mongoose");

const invitLinkSchema = mongoose.Schema({
    code: String,
    clint: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    markter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companies: Array,
    isapproved: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model("Invitlink", invitLinkSchema);