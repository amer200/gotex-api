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
    }
})

module.exports = mongoose.model("User", userSchema);