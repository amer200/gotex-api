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
    default: false,
  },
  rolle: String,
  wallet: {
    type: Number,
    default: 0,
  },
  cr: [String],
  iscrproofed: {
    type: Boolean,
    default: false,
  },
  inv: { type: mongoose.Schema.Types.ObjectId, ref: "Invitation" },
  package: {
    price: Number,
    numberOfOrders: Number,
    userAvailableOrders: Number,
    companies: Array,
  },
});

module.exports = mongoose.model("User", userSchema);
