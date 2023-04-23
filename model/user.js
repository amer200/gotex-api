const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String,
    mobile: String,
    address: String,
    location: String,
    verified: {
        type: Boolean,
        default: false
    },
    rolle: String
})

module.exports = mongoose.model("User", userSchema);