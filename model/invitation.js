const mongoose = require("mongoose");

const invitationSchema = mongoose.Schema({
    code: String,
    clintemail: String,
    clint: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    markter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companies: Array,
    isapproved: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model("Invitation", invitationSchema);