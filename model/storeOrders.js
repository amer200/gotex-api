const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // quantity * price
  },
  { _id: false }
);

const StoreOrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    client: { type: Schema.Types.ObjectId, ref: "Clint" },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true, enum: ["cod", "cc"] },
    order: {
      for: {
        type: String,
        enum: ["user", "client"],
      },
      payedFrom: {
        type: String,
        enum: ["user-wallet", "client-wallet", "client-credit"],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StoreOrders", StoreOrderSchema);
