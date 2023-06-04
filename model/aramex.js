const mongoose = require('mongoose');

const aramexSchema = mongoose.Schema({
    name: {
        type: String,
        default: "aramex"
    },
    userprice: {
        type: Number,
        default: 22,
    },
    marketerprice: {
        type: Number,
        default: 22,
    },
    kgprice: {
        type: Number,
        default: 22,
    },
    status: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model("aramex", aramexSchema);