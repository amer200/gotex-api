const mongoose = require('mongoose');

const gotexSchema = mongoose.Schema({
    name: {
        type: String,
        default: "gotex"
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
    codprice: {
        type: Number,
        default: 10
    },
    mincodmarkteer: {
        type: Number,
        default: 10
    },
    maxcodmarkteer: {
        type: Number,
        default: 10
    },
    status: {
        type: Boolean,
        default: false,
    },
})

module.exports = mongoose.model("gotex", gotexSchema);