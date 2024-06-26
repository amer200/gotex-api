const Smsa = require("../model/smsa");
const SmsaOrder = require("../model/smsaorders");
const axios = require("axios");
const { AxiosError } = require("axios");
const base64 = require("base64topdf");
const User = require("../model/user");
const Clint = require("../model/clint");
const ccOrderPay = require("../modules/ccOrderPay");
const Order = require("../model/orders");

exports.edit = (req, res) => {
  const status = req.body.status;
  const userprice = req.body.userprice;
  const userCodPrice = req.body.userCodPrice;
  const marketerprice = req.body.marketerprice;
  const mincodmarkteer = req.body.mincodmarkteer;
  const maxcodmarkteer = req.body.maxcodmarkteer;
  const kgprice = req.body.kgprice;
  Smsa.findOne()
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
  const {
    c_name,
    c_ContactPhoneNumber,
    c_ContactPhoneNumber2 = "",
    c_District,
    c_City,
    c_AddressLine1,
    c_AddressLine2 = "",
    p_name,
    p_ContactPhoneNumber,
    p_District,
    p_City,
    p_AddressLine1,
    p_AddressLine2 = "",
    pieces,
    weight,
    description,
    Value,
    cod,
    markterCode,
    clintid,
  } = req.body;
  const userId = req.user.user.id;

  try {
    const userPromise = User.findById(userId);
    let ordersNumPromise = SmsaOrder.count();
    const totalShipPrice = res.locals.totalShipPrice;

    if (cod) {
      var cashondelivery = res.locals.codAmount;
      var paytype = "cod";
    } else {
      var cashondelivery = 0;
      var paytype = "cc";
    }
    if (markterCode) {
      var nameCode = `${p_name} (${markterCode})`;
    } else {
      var nameCode = p_name;
    }
    const date = new Date().toISOString().split("T")[0];

    var data = JSON.stringify({
      ConsigneeAddress: {
        ContactName: c_name,
        ContactPhoneNumber: c_ContactPhoneNumber,
        ContactPhoneNumber2: c_ContactPhoneNumber2,
        Coordinates: "",
        Country: "SA",
        District: c_District,
        PostalCode: "",
        City: c_City,
        AddressLine1: c_AddressLine1,
        AddressLine2: c_AddressLine2,
      },
      ShipperAddress: {
        ContactName: nameCode,
        ContactPhoneNumber: p_ContactPhoneNumber,
        Coordinates: "",
        Country: "SA",
        District: p_District,
        PostalCode: "",
        City: p_City,
        AddressLine1: p_AddressLine1,
        AddressLine2: p_AddressLine2,
      },
      OrderNumber: "FirstOrder001", /// code
      DeclaredValue: Value,
      CODAmount: cashondelivery,
      Parcels: pieces,
      ShipDate: `${date}`,
      ShipmentCurrency: "SAR",
      SMSARetailID: "0",
      WaybillType: "PDF",
      Weight: weight,
      WeightUnit: "KG",
      ContentDescription: description,
      VatPaid: true,
      DutyPaid: false,
    });

    const sender = {
      name: p_name,
      mobile: p_ContactPhoneNumber,
      city: p_City,
      address: p_AddressLine1,
      address2: p_AddressLine2,
      province: p_District,
    };

    const receiver = {
      name: c_name,
      mobile: c_ContactPhoneNumber,
      mobile2: c_ContactPhoneNumber2,
      city: c_City,
      address: c_AddressLine1,
      address2: c_AddressLine2,
      province: c_District,
    };

    var config = {
      method: "post",
      url: "https://ecomapis.smsaexpress.com/api/shipment/b2c/new",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SMSA_API_KEY,
      },
      data: data,
    };
    const responsePromise = await axios(config);
    const [ordersNum, user, response] = await Promise.all([
      ordersNumPromise,
      userPromise,
      responsePromise,
    ]);

    const order = await SmsaOrder.create({
      user: userId,
      company: "smsa",
      ordernumber: ordersNum + 1,
      data: response.data,
      sender,
      receiver,
      price: totalShipPrice,
      codPrice: res.locals.codAmount,
      weight: weight,
      paytype: paytype,
      marktercode: markterCode,
      created_at: new Date(),
    });
    const myOrder = await Order.create({
      _id: order._id,
      user: userId,
      company: "smsa",
      ordernumber: ordersNum + 1,
      data: response.data,
      sender,
      receiver,
      price: totalShipPrice,
      codPrice: res.locals.codAmount,
      weight: weight,
      paytype: paytype,
      marktercode: markterCode,
      created_at: new Date(),
    });

    if (response.status !== 200) {
      order.status = "failed";
      await Promise.all([order.save(), myOrder.save()]);

      res.status(400).json({
        msg: response.data,
      });
    }

    let i = 1;
    response.data.waybills.forEach((a) => {
      base64.base64Decode(
        a.awbFile,
        `public/smsaAwb/${ordersNum + 1}-p${i}.pdf`
      );
      i++;
    });

    let clint = {};
    if (clintid) {
      clint = await Clint.findById(clintid);
      if (!clint) {
        return res.status(400).json({ error: "Client not found" });
      }
      const co = {
        company: "smsa",
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
        companyName: "smsa",
        order,
      };
      await ccOrderPay(ccOrderPayObj);
    }

    myOrder.billCode = response.data.sawb;
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
  } catch (error) {
    console.log(error);
    if (
      error instanceof AxiosError &&
      Object.keys(error.response.data).length
    ) {
      res.status(500).json({
        msg: error.response.data,
      });
    } else {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
};
exports.getUserOrders = (req, res) => {
  const userId = req.user.user.id;
  SmsaOrder.find({ user: userId, status: { $ne: "failed" } })
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
exports.getSticker = (req, res) => {
  const orderId = req.params.id;
  SmsaOrder.findById(orderId).then((order) => {
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    let routes = [];
    let i = 1;
    order.data.waybills.forEach((w) => {
      routes.push(`/smsaAwb/${order.ordernumber}-p${i}.pdf`);
      i++;
    });
    res.status(200).json({
      msg: "ok",
      data: routes,
    });
  });
};
