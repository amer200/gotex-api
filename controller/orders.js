const User = require("../model/user");
const Order = require("../model/orders");
const paginate = require("../modules/paginate");
const refundCanceledOrder = require("../modules/refundCanceledOrder");
const mongoose = require("mongoose");
const AnwanOrder = require("../model/anwanorders");
const AramexOrder = require("../model/aramexorders");
const ImileOrder = require("../model/imileorders");
const JtOrder = require("../model/jtorders");
const GltOrder = require("../model/gltorders");
const SaeeOrder = require("../model/saeeorders");
const SmsaOrder = require("../model/smsaorders");
const SplOrder = require("../model/splorders");

const {
  countDocsAfterFiltering,
  createPaginationObj,
} = require("../modules/pagination");

/**
 * @Desc :  Filter with company, paytype, billCode, marktercode or keyword (user data -> name, email or mobile)
 *        + Pagination
 */
exports.getOrders = async (req, res) => {
  /**Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
  let page = +req.query.page || 1;
  const limit = +req.query.limit || 30;
  const skip = (page - 1) * limit;
  const {
    company = "",
    paytype = "",
    billCode = "",
    marktercode = "",
    keyword = "",
  } = req.query;

  try {
    let matchStage = {};
    if (!company && !paytype && !billCode && !marktercode && !keyword) {
      matchStage = { $match: {} };
    } else if (!keyword) {
      matchStage = {
        $match: {
          paytype: { $regex: paytype, $options: "i" }, // $options: 'i' to make it case-insensitive (accept capital or small chars)
          marktercode: { $regex: marktercode, $options: "i" },
          company: { $regex: company, $options: "i" },
          billCode: { $regex: billCode, $options: "i" },
          status: { $ne: "failed" },
        },
      };
    } else {
      matchStage = {
        $match: {
          paytype: { $regex: paytype, $options: "i" }, // $options: 'i' to make it case-insensitive (accept capital or small chars)
          marktercode: { $regex: marktercode, $options: "i" },
          company: { $regex: company, $options: "i" },
          billCode: { $regex: billCode, $options: "i" },
          status: { $ne: "failed" },
          $or: [
            { "user.name": { $regex: keyword, $options: "i" } },
            { "user.email": { $regex: keyword, $options: "i" } },
            { "user.mobile": { $regex: keyword, $options: "i" } },
          ],
        },
      };
    }

    const lookupStages = [
      {
        $lookup: {
          // populate with user data
          from: "users", // collection name in mongoDB
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "markters",
          localField: "marktercode",
          foreignField: "code",
          as: "marketer",
        },
      },
    ];

    const ordersPerPage = await Order.aggregate([
      ...lookupStages,
      matchStage,
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          billFile: "$data.waybills.awbFile",
        },
      },
      {
        $project: {
          // select
          __v: 0,
          "user.password": 0,
          "user.address": 0,
          "user.location": 0,
          "user.emailcode": 0,
          "user.verified": 0,
          "user.rolle": 0,
          "user.wallet": 0,
          "user.cr": 0,
          "user.iscrproofed": 0,
          "user.__v": 0,
          "user.package": 0,

          "marketer._id": 0,
          "marketer.password": 0,
          "marketer.email": 0,
          "marketer.mobile": 0,
          "marketer.code": 0,
          "marketer.__v": 0,

          data: 0,
        },
      },
    ]);

    // To calculate pagination info
    const totalCount = await countDocsAfterFiltering(
      Order,
      matchStage,
      lookupStages
    );
    const pagination = createPaginationObj(page, limit, totalCount);

    res.status(200).json({
      result: ordersPerPage.length,
      pagination,
      data: ordersPerPage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  const userId = req.user.user.id;

  let page = +req.query.page || 1;
  const limit = +req.query.limit || 30;
  const skip = (page - 1) * limit;
  const { company = "", billCode = "", marktercode = "" } = req.query;

  try {
    let matchStage = { user: new mongoose.Types.ObjectId(userId) };
    if (company || billCode || marktercode) {
      matchStage = {
        user: new mongoose.Types.ObjectId(userId),
        company: { $regex: company, $options: "i" },
        billCode: { $regex: billCode, $options: "i" },
        marktercode: { $regex: marktercode, $options: "i" },
      };
    }

    const ordersPromise = Order.aggregate([
      {
        $match: matchStage,
      },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          billFile: "$data.waybills.awbFile",
        },
      },
      {
        $project: {
          __v: 0,
          data: 0,
        },
      },
    ]);

    const allOrdersPromise = Order.aggregate([
      {
        $match: matchStage,
      },
      { $count: "totalCount" },
    ]);
    const [orders, allOrders] = await Promise.all([
      ordersPromise,
      allOrdersPromise,
    ]);

    let numberOfOrders,
      numberOfPages = 0;
    if (allOrders[0]) {
      numberOfOrders = allOrders[0].totalCount;
      numberOfPages =
        numberOfOrders % limit == 0
          ? numberOfOrders / limit
          : Math.floor(numberOfOrders / limit) + 1;
    }

    res.status(200).json({
      result: orders.length,
      pagination: {
        currentPage: page,
        limit,
        numberOfPages,
      },
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

// Filter orders by date + company
exports.filterOrdersByDate = async (req, res) => {
  /** Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
  let page = +req.query.page || 1;
  const limit = +req.query.limit || 30;
  const skip = (page - 1) * limit;
  const startDate = req.query.startDate || new Date("2000-01-01");
  const endDate = req.query.endDate || new Date();
  const { company = "" } = req.query;

  try {
    console.time("blocking await");
    const query = {
      company: { $regex: company, $options: "i" },
      created_at: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $ne: "failed" },
    };
    const populateObj = {
      path: "user",
      select: "name email mobile",
    };

    let ordersPerPage = await Order.find(query)
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip)
      .populate(populateObj)
      .select("-__v -data");

    const numberOfOrders = await Order.find(query).countDocuments();
    const numberOfPages =
      numberOfOrders % limit == 0
        ? numberOfOrders / limit
        : Math.floor(numberOfOrders / limit) + 1;

    console.timeEnd("blocking await");
    res.status(200).json({
      result: ordersPerPage.length,
      pagination: {
        currentPage: page,
        limit,
        numberOfPages,
      },
      data: ordersPerPage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }

    res.status(200).json({
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.cancelOrderRequest = async (req, res) => {
  const { orderId, cancelReason = "" } = req.body;
  const userId = req.user.user.id;
  const order = await Order.findById(orderId);
  try {
    if (!order || order.user != userId) {
      return res.status(400).json({
        err: "order not found",
      });
    }
    if (order.status == "canceled") {
      return res.status(400).json({
        err: "This order is already canceled",
      });
    }
    order.cancel.request = true;
    order.cancelReason = cancelReason;
    await order.save();
    return res.status(200).json({
      msg: "Your canceling request is saved. Wait until admin accept it.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: err.message,
    });
  }
};
exports.cancelOrderRequestStatus = async (req, res) => {
  const { orderId, requestStatus } = req.body;
  const order = await Order.findById(orderId);
  try {
    if (!order) {
      return res.status(400).json({
        err: "order not found",
      });
    }
    if (order.status == "canceled") {
      return res.status(400).json({
        err: "This order is already canceled",
      });
    }
    order.cancel.requestStatus = requestStatus;
    if (requestStatus == "accepted") {
      order.status = "canceled";
      await refundCanceledOrder(order);
    }

    await order.save();
    return res.status(200).json({ msg: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: err.message,
    });
  }
};

exports.getCancelOrderRequests = async (req, res) => {
  try {
    const orders = await Order.find({
      "cancel.request": true,
      company: { $nin: ["saee", "imile", "jt"] },
    }).sort({ created_at: -1 });

    return res.status(200).json({ result: orders.length, data: orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: err.message,
    });
  }
};
