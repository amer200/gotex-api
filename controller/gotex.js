const axios = require("axios");
const { AxiosError } = require("axios");
const Gotex = require("../model/gotex");
const User = require("../model/user");
const Clint = require("../model/clint");
const ccOrderPay = require("../modules/ccOrderPay");
const Order = require("../model/orders");
const refundCanceledOrder = require("../modules/refundCanceledOrder");
const FormData = require("form-data");
const fs = require("fs");

const baseUrl = "https://dashboard.go-tex.net/logistics-test";

exports.edit = async (req, res) => {
  const {
    status,
    userprice,
    codprice,
    marketerprice,
    mincodmarkteer,
    maxcodmarkteer,
    kgprice,
  } = req.body;

  try {
    const gotex = await Gotex.findOne();

    gotex.status = status;
    gotex.userprice = userprice;
    gotex.codprice = codprice;
    gotex.marketerprice = marketerprice;
    gotex.mincodmarkteer = mincodmarkteer;
    gotex.maxcodmarkteer = maxcodmarkteer;
    gotex.kgprice = kgprice;
    await gotex.save();

    res.status(200).json({
      msg: "ok",
      data: gotex,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.createUserOrder = async (req, res) => {
  const userId = req.user.user.id;
  const {
    sendername,
    senderphone,
    sendercity,
    senderdistrict,
    senderdistrictId,
    senderaddress,
    recivername,
    reciverphone,
    recivercity,
    reciverdistrict,
    reciverdistrictId,
    reciveraddress,
    price,
    weight,
    pieces,
    description,

    cod,
    markterCode = "",
    clintid,
  } = req.body;
  const cashondelivery = res.locals.codAmount;
  const totalShipPrice = res.locals.totalShipPrice;

  const userPromise = User.findById(userId);

  let paytype = "";
  if (cod) {
    paytype = "cod";
  } else {
    paytype = "cc";
  }

  const data = {
    userId: process.env.GOTEX_USER_ID,
    apiKey: process.env.GOTEX_API_KEY,

    sendername,
    senderphone,
    sendercity,
    senderdistrict,
    senderdistrictId,
    senderaddress,
    recivername,
    reciverphone,
    recivercity,
    reciverdistrict,
    reciverdistrictId,
    reciveraddress,
    weight,
    pieces,
    description,

    paytype,
    price: cashondelivery,
  };

  const sender = {
    name: sendername,
    mobile: senderphone,
    city: sendercity,
    district: senderdistrict,
    districtId: senderdistrictId,
    address: senderaddress,
  };

  const receiver = {
    name: recivername,
    mobile: reciverphone,
    city: recivercity,
    district: reciverdistrict,
    districtId: reciverdistrictId,
    address: reciveraddress,
  };

  try {
    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      url: `${baseUrl}/integrate/order/create-order`,
      data,
    };
    const responsePromise = axios(config);
    const [response, user] = await Promise.all([responsePromise, userPromise]);

    const order = await Order.create({
      _id: response.data._id,
      user: userId,
      company: "gotex",
      data: response.data.data,
      sender,
      receiver,
      billCode: response.data.data.ordernumber,
      paytype,
      price: totalShipPrice,
      codPrice: cashondelivery,
      weight: weight,
      created_at: new Date(),
    });

    let clint = {};
    if (clintid) {
      clint = await Clint.findById(clintid);
      if (!clint) {
        return res.status(400).json({ error: "Client not found" });
      }
      const co = {
        company: "gotex",
        id: order._id,
      };
      clint.orders.push(co);

      order.marktercode = clint.marktercode ? clint.marktercode : markterCode;
      await clint.save();
    }
    await order.save();

    if (!cod) {
      const ccOrderPayObj = {
        clintid,
        clint,
        totalShipPrice,
        user,
        companyName: "gotex",
        order,
      };
      await ccOrderPay(ccOrderPayObj);
    }

    return res.status(200).json({
      msg: "order created",
      data: order,
      clientData: {
        package: clint.package,
        wallet: clint.wallet,
        credit: clint.credit,
      },
    });
  } catch (err) {
    if (err instanceof AxiosError && Object.keys(err.response.data).length) {
      res.status(500).json({
        msg: err.response.data,
      });
    } else {
      res.status(500).json({
        msg: err.message,
      });
    }
  }
};

exports.getUserOrders = async (req, res) => {
  const userId = req.user.user.id;
  try {
    const orders = await Order.find({
      user: userId,
      company: "gotex",
      status: { $ne: "failed" },
    }).sort({ created_at: -1 });

    res.status(200).json({
      result: orders.length,
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getSticker = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ _id: orderId, company: "gotex" });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    console.log(order);
    const config = {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      url: `${baseUrl}/integrate/order/getorder/${order.data._id}`,
      data: {
        userId: process.env.GOTEX_USER_ID,
        apiKey: process.env.GOTEX_API_KEY,
      },
    };

    const response = await axios(config);
    const bill = `${baseUrl}/${response.data.url}`;

    res.status(200).json({
      msg: "ok",
      data: bill,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof AxiosError && Object.keys(err.response.data).length) {
      res.status(500).json({
        msg: err.response.data,
      });
    } else {
      res.status(500).json({
        msg: err.message,
      });
    }
  }
};

exports.cancelOrder = async (req, res) => {
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

    let images = [];
    if (req.files && req.files[0]) {
      req.files.forEach((f) => {
        images.push(f);
      });
    }

    const formData = new FormData();
    formData.append("userId", process.env.GOTEX_USER_ID);
    formData.append("apiKey", process.env.GOTEX_API_KEY);
    formData.append("orderId", order.data._id);
    formData.append("description", cancelReason);

    images.forEach((image, index) => {
      formData.append(
        `images`,
        fs.createReadStream(image.path),
        image.originalname
      );
    });

    const config = {
      method: "PUT",
      url: `${baseUrl}/integrate/order/cancel-order`,
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
    };

    const response = await axios.request(config);

    order.status = "canceled";
    order.cancelReason = cancelReason;
    await order.save(order);
    await refundCanceledOrder(order);

    return res.status(200).json({ data: response.data });
  } catch (err) {
    console.log(err);
    if (err instanceof AxiosError && Object.keys(err.response.data).length) {
      res.status(500).json({
        msg: err.response.data,
      });
    } else {
      res.status(500).json({
        msg: err.message,
      });
    }
  }
};
