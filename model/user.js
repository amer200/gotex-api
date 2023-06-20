const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String,
    mobile: String,
    address: String,
    location: String,
    emailcode: String,
    verified: {
        type: Boolean,
        default: false
    },
    rolle: String,
    wallet: {
        type: Number,
        default: 0
    },
    cr: [String],
    iscrproofed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("User", userSchema);