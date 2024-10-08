const mongoose = require("mongoose");

const clintSchema = mongoose.Schema(
  {
    name: String,
    company: {
      type: String,
      default: "",
    },
    email: String,
    mobile: String,
    city: String,
    address: String,
    notes: String,
    street: String,
    wallet: {
      type: Number,
      default: 0,
    },
    category: String,
    addby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orders: [
      {
        company: String,
        id: String,
        markter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    credit: {
      status: String,
      limet: Number,
      addby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    marktercode: String,
    branches: [
      {
        city: String,
        address: String,
      },
    ],
    receipts: {
      type: [String],
    },
    package: {
      price: Number,
      numberOfOrders: Number,
      companies: Array,
      paidBy: { type: String, enum: ["client", "marketer"] },
      availableOrders: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Clint", clintSchema);
