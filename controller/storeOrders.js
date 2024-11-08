const Order = require("../model/storeOrders");
const Product = require("../model/product");
const User = require("../model/user");
const Client = require("../model/clint");
const ccStoreOrderPay = require("../modules/ccStoreOrderPay");

// Create a new order
const createOrder = async (req, res) => {
  const userId = req.user.user.id;
  const { clientId, items, shippingAddress, paymentMethod } = req.body;

  try {
    let totalAmount = 0;
    const orderItems = [];

    // Calculate total amount
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res
          .status(404)
          .json({ message: `Product with ID ${item.product} not found` });

      // Check if product is in stock
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for product: ${product.name}` });
      }

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      });
      totalAmount += product.price * item.quantity;
    }
    console.log(paymentMethod);
    const newOrder = new Order({
      user: userId,
      client: clientId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });
    let client = {};
    console.log(clientId);
    if (clientId) {
      client = await Client.findById(clientId);
      if (!client) {
        return res.status(400).json({ error: "Client not found" });
      }
    }

    if (paymentMethod == "cc") {
      const user = await User.findById(userId);

      const ccOrderPayObj = {
        clientId,
        client,
        totalAmount,
        user,
        order: newOrder,
      };

      await ccStoreOrderPay(ccOrderPayObj);
    }

    // After successful order, you can also reduce the stock quantity
    for (let item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }, // Decrease the stock by the ordered quantity
      });
    }

    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
// Get all orders (for admin or user's order history)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product");
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const orders = await Order.find({ user: userId }).populate("items.product");

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Update the status of an order (e.g., Pending -> Shipped -> Delivered)
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Delete an order by ID (maybe for cancellation)
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
  getUserOrders,
};
