const axios = require("axios");
const Saee = require("../model/saee");
const SaeeOrder = require("../model/saeeorders");
const User = require("../model/user");
const Clint = require("../model/clint");
const ccOrderPay = require("../modules/ccOrderPay");
const Order = require("../model/orders");
const refundCanceledOrder = require("../modules/refundCanceledOrder");

exports.edit = (req, res) => {
  const status = req.body.status;
  const userprice = req.body.userprice;
  const userCodPrice = req.body.userCodPrice;
  const marketerprice = req.body.marketerprice;
  const mincodmarkteer = req.body.mincodmarkteer;
  const maxcodmarkteer = req.body.maxcodmarkteer;
  const kgprice = req.body.kgprice;
  Saee.findOne()
    .then((s) => {
      s.status = status;
      s.userprice = userprice;
      s.marketerprice = marketerprice;
      s.kgprice = kgprice;
      s.maxcodmarkteer = maxcodmarkteer;
      s.mincodmarkteer = mincodmarkteer;
      s.codprice = userCodPrice;
      return s.save();
    })
    .then((s) => {
      res.status(200).json({
        msg: "ok",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: err.message,
      });
    });
};
exports.createUserOrder = async (req, res) => {
  let ordersNum = await SaeeOrder.count();
  const userId = req.user.user.id;
  const userPromise = User.findById(userId);
  const saeePromise = Saee.findOne();
  const p_name = req.body.p_name;
  const p_city = req.body.p_city;
  const p_mobile = req.body.p_mobile;
  const p_streetaddress = req.body.p_streetaddress;
  const weight = req.body.weight;
  const quantity = req.body.quantity;
  const c_name = req.body.c_name;
  const c_city = req.body.c_city;
  const c_streetaddress = req.body.c_streetaddress;
  const c_mobile = req.body.c_mobile;
  const cod = req.body.cod;
  const markterCode = req.body.markterCode || "";
  const totalShipPrice = res.locals.totalShipPrice;
  const clintid = req.body.clintid;
  const description = req.body.description;
  if (cod) {
    var cashondelivery = res.locals.codAmount;
    var paytype = "cod";
  } else {
    var cashondelivery = res.locals.codAmount;
    var paytype = "cc";
  }
  if (markterCode) {
    var nameCode = `${p_name} (${markterCode})`;
  } else {
    var nameCode = p_name;
  }
  var data = {
    secret: process.env.SAEE_KEY_P,
    cashonpickup: 0,
    p_name: p_name,
    p_city: p_city,
    p_mobile: p_mobile,
    p_streetaddress: p_streetaddress,
    cashondelivery: cashondelivery,
    weight: weight,
    quantity: quantity,
    c_name: c_name,
    c_city: c_city,
    c_streetaddress: c_streetaddress,
    c_mobile: c_mobile,
    ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
    sendername: nameCode,
    senderphone: p_mobile,
    senderaddress: p_streetaddress,
    sendercity: p_city,
    // sendercountry: "SA"
  };

  const sender = {
    name: p_name,
    mobile: p_mobile,
    city: p_city,
    address: p_streetaddress,
  };

  const receiver = {
    name: c_name,
    mobile: c_mobile,
    city: c_city,
    address: c_streetaddress,
  };

  try {
    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      url: "https://k-w-h.com/deliveryrequest/newpickup",
      data: data,
    };
    const responsePromise = axios(config);
    const [user, saee, response] = await Promise.all([
      userPromise,
      saeePromise,
      responsePromise,
    ]);

    const order = await SaeeOrder.create({
      user: userId,
      company: "saee",
      ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
      data: response.data,
      sender,
      receiver,
      paytype: paytype,
      price: totalShipPrice,
      codPrice: res.locals.codAmount,
      weight: weight,
      marktercode: markterCode,
      created_at: new Date(),
    });

    const myOrder = await Order.create({
      _id: order._id,
      user: userId,
      company: "saee",
      ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
      data: response.data,
      sender,
      receiver,
      paytype: paytype,
      price: totalShipPrice,
      codPrice: res.locals.codAmount,
      weight: weight,
      marktercode: markterCode,
      created_at: new Date(),
    });

    if (!response.data.success) {
      order.status = "failed";
      await Promise.all([order.save(), myOrder.save()]);

      return res.status(400).json({
        msg: response.data,
      });
    }

    let clint = {};
    if (clintid) {
      clint = await Clint.findById(clintid);
      if (!clint) {
        return res.status(400).json({ error: "Client not found" });
      }
      const co = {
        company: "saee",
        id: order._id,
      };
      clint.orders.push(co);

      order.marktercode = clint.marktercode ? clint.marktercode : markterCode;
      await clint.save();
    }

    if (!cod) {
      const ccOrderPayObj = {
        clintid,
        clint,
        totalShipPrice,
        user,
        companyName: "saee",
        order,
      };
      await ccOrderPay(ccOrderPayObj);
    }

    myOrder.billCode = response.data.waybill;
    myOrder.order = order.order;
    await Promise.all([order.save(), myOrder.save()]);

    res.status(200).json({
      msg: "order created successfully",
      data: order,
      clientData: {
        package: clint.package,
        wallet: clint.wallet,
        credit: clint.credit,
      },
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
  SaeeOrder.find({ user: userId, status: { $ne: "failed" } })
    .sort({ created_at: -1 })
    .then((o) => {
      res.status(200).json({
        data: o,
      });
    })
    .catch((err) => {
      console.log(err.request);
    });
};
exports.getSticker = async (req, res) => {
  const orderId = req.params.id;
  SaeeOrder.findById(orderId)
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const data = { waybill: order.data.waybill };
      axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          secret: `${process.env.SAEE_KEY_P}`,
        },
        url: `https://corporate.k-w-h.com/deliveryrequest/printsticker/WAYBILL`,
        data,
      }).then((bill) => {
        res.status(200).json({
          msg: "ok",
          data: bill.data,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.trakingOrderByNum = async (req, res) => {
  const orderId = req.body.orderId;
  const order = await SaeeOrder.findById(orderId);
  axios({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      secret: `${process.env.SAEE_KEY_P}`,
    },
    url: `https://corporate.k-w-h.com/tracking/ordernumber`,
    ordernumber: order.data.waybill,
  })
    .then((response) => {
      res.status(200).json({
        data: response.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getCities = (req, res) => {
  axios({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      secret: `${process.env.SAEE_KEY_P}`,
    },
    url: `https://corporate.k-w-h.com/deliveryrequest/getallcities`,
  })
    .then((response) => {
      res.status(200).json({
        data: response.data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
};

exports.cancelOrder = async (req, res) => {
  const { orderId, cancelReason = "" } = req.body;
  const userId = req.user.user.id;
  const order = await SaeeOrder.findById(orderId);

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

    let data = JSON.stringify({
      waybill: order.data.waybill,
      canceled_by: 1,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://corporate.k-w-h.com/deliveryrequest/cancelpickup",
      headers: {
        secret: process.env.SAEE_KEY_P,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const saeeRes = await axios.request(config);
    if (saeeRes.data.success == true) {
      order.status = "canceled";
      order.cancelReason = cancelReason;
      await order.save(order);

      await refundCanceledOrder(order);

      return res.status(200).json({ data: saeeRes.data });
    } else {
      return res.status(400).json({ data: saeeRes.data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: err.message,
    });
  }
};
