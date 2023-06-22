const mongoose = require("mongoose");

const invitLinkSchema = mongoose.Schema({
    code: String,
    markter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isused: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model("Invitlink", invitLinkSchema);