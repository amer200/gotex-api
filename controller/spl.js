const Spl = require("../model/spl");
const SplOrder = require("../model/splorders");
const axios = require("axios");
const qs = require("qs");
const User = require("../model/user");
const Clint = require("../model/clint");
const CronJob = require("cron").CronJob;
const ccOrderPay = require("../modules/ccOrderPay");
const Order = require("../model/orders");

//********************************************* */
exports.edit = (req, res) => {
  const status = req.body.status;
  const userprice = req.body.userprice;
  const userCodPrice = req.body.userCodPrice;
  const marketerprice = req.body.marketerprice;
  const mincodmarkteer = req.body.mincodmarkteer;
  const maxcodmarkteer = req.body.maxcodmarkteer;
  const kgprice = req.body.kgprice;
  Spl.findOne()
    .then((a) => {
      a.status = status;
      a.userprice = userprice;
      a.marketerprice = marketerprice;
      a.kgprice = kgprice;
      a.maxcodmarkteer = maxcodmarkteer;
      a.mincodmarkteer = mincodmarkteer;
      a.codprice = userCodPrice;
      return a.save();
    })
    .then((a) => {
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

exports.getToken = (req, res) => {
  const grant_type = "password";
  const UserName = process.env.spl_userName;
  const Password = process.env.spl_password;
  var data = qs.stringify({
    grant_type: "password",
    UserName: UserName,
    Password: Password,
  });
  var config = {
    method: "post",
    url: "https://gateway-minasa.sp.com.sa/APIGateway/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  axios(config)
    .then((response) => {
      console.log(response);
      Spl.findOne()
        .then((s) => {
          s.token = response.data.access_token;
          return s.save();
        })
        .then((s) => {
          res.status(200).json({
            msg: "token updated",
          });
        });
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.creteNewOrder = async (req, res) => {
  const {
    reciverName,
    reciverMobile,
    SenderName,
    SenderMobileNumber,
    ContentPrice,
    ContentDescription,
    weight,
    pickUpDistrictID,
    pickUpDistrict,
    pickUpGovernorate,
    pickUpAddress1,
    pickUpAddress2,
    deliveryDistrictID,
    deliveryDistrict,
    deliveryGovernorate,
    deliveryAddress1,
    deliveryAddress2,
    clintid,
    cod,
    BoxLength,
    BoxWidth,
    BoxHeight,
  } = req.body;
  let Pieces = req.body.Pieces;
  const markterCode = req.body.markterCode || "";
  const totalShipPrice = res.locals.totalShipPrice;
  if (Pieces) {
    if (Pieces.length <= 0) {
      Pieces = [];
      var PiecesCount = 1;
    } else {
      var PiecesCount = Pieces.length + 1;
    }
  }

  const spl = await Spl.findOne();
  const userId = req.user.user.id;
  const userPromise = User.findById(userId);
  let ordersNumPromise = SplOrder.count();
  if (markterCode) {
    var nameCode = `${SenderName} (${markterCode})`;
  } else {
    var nameCode = SenderName;
  }
  //********************************* */
  if (cod) {
    var PaymentType = 2;
    var paytype = "cod";
    var TotalAmount = res.locals.codAmount;
  } else {
    var PaymentType = 1;
    var paytype = "cc";
    var TotalAmount = res.locals.codAmount;
  }
  const data = {
    CRMAccountId: process.env.spl_accountId,
    // 'BranchId': 0,
    PickupType: 0,
    RequestTypeId: 1,
    CustomerName: reciverName,
    CustomerMobileNumber: reciverMobile,
    SenderName: SenderName,
    SenderMobileNumber: SenderMobileNumber,
    Items: [
      {
        ReferenceId: `${Date.now()} + Gotex`,
        PaymentType: PaymentType,
        ContentPrice: ContentPrice,
        ContentDescription: ContentDescription,
        Weight: weight,
        BoxLength: BoxLength,
        BoxWidth: BoxWidth,
        BoxHeight: BoxHeight,
        TotalAmount: TotalAmount,
        SenderAddressDetail: {
          AddressTypeID: 6,
          LocationId: 21,
          DistrictID: pickUpDistrictID,
          AddressLine1: pickUpAddress1,
          AddressLine2: pickUpAddress2,
        },
        ReceiverAddressDetail: {
          AddressTypeID: 6,
          LocationId: 21,
          DistrictID: deliveryDistrictID,
          AddressLine1: deliveryAddress1,
          AddressLine2: deliveryAddress2,
        },
        PiecesCount: PiecesCount,
        ItemPieces: Pieces,
      },
    ],
  };

  const sender = {
    name: SenderName,
    mobile: SenderMobileNumber,
    city: pickUpDistrict,
    governorate: pickUpGovernorate,
    cityId: pickUpDistrictID,
    AddressLine1: pickUpAddress1,
    AddressLine2: pickUpAddress2,
  };

  const receiver = {
    name: reciverName,
    mobile: reciverMobile,
    city: deliveryDistrict,
    governorate: deliveryGovernorate,
    cityId: deliveryDistrictID,
    AddressLine1: deliveryAddress1,
    AddressLine2: deliveryAddress2,
  };

  try {
    var config = {
      method: "post",
      url: "https://gateway-minasa.sp.com.sa/APIGateway/api/CreditSale/AddUPDSPickupDelivery",
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `bearer ${spl.token}`,
      },
      data: data,
    };
    console.log(typeof totalShipPrice);
    console.log("data");
    console.log(data);

    // return res.status(200).json({
    //     body: data
    // })

    const responsePromise = axios(config);
    const [ordersNum, user, response] = await Promise.all([
      ordersNumPromise,
      userPromise,
      responsePromise,
    ]);

    console.log("response.data");
    console.log(response.data);
    const order = await SplOrder.create({
      user: userId,
      company: "Spl",
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
      desc: ContentDescription,
    });
    const myOrder = await Order.create({
      _id: order._id,
      user: userId,
      company: "Spl",
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
      desc: ContentDescription,
    });
    console.log("order");
    console.log(order);
    if (response.data.Status != 1) {
      order.status = "failed";
      await Promise.all([order.save(), myOrder.save()]);

      res.status(400).json({
        data: response.data,
      });
    } else {
      let clint = {};
      if (clintid) {
        clint = await Clint.findById(clintid);
        if (!clint) {
          return res.status(400).json({ error: "Client not found" });
        }
        const co = {
          company: "spl",
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
          companyName: "spl",
          order,
        };
        await ccOrderPay(ccOrderPayObj);
      }

      myOrder.billCode = response.data.Items[0]?.Barcode;
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
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
exports.getUserOrders = async (req, res) => {
  const userId = req.user.user.id;
  SplOrder.find({ user: userId, status: { $ne: "failed" } })
    .sort({ created_at: -1 })
    .then((o) => {
      res.status(200).json({
        data: o,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await SplOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ data: order });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};
exports.getCountries = async (req, res) => {
  const spl = await Spl.findOne();
  var data = qs.stringify({
    CountryID: null,
  });
  var config = {
    method: "post",
    url: "https://gateway-minasa.sp.com.sa/APIGateway/api/Location/GetCountries",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `bearer ${spl.token}`,
    },
    data: data,
  };
  axios(config)
    .then((response) => {
      console.log(response);
      res.status(200).json({
        data: response.data,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getCities = async (req, res) => {
  const spl = await Spl.findOne();
  var data = qs.stringify({
    language: "A",
  });
  var config = {
    method: "post",
    url: "https://gateway-minasa.sp.com.sa/APIGateway/api/GIS/GetCitiesByRegion",
    headers: {
      Authorization: `bearer ${spl.token}`,
    },
    data: data,
  };
  axios(config)
    .then((response) => {
      res.status(200).json({
        data: response.data,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getDistrict = async (req, res) => {
  const spl = await Spl.findOne();
  var data = qs.stringify({
    language: "A",
    RegionId: null,
  });
  var config = {
    method: "post",
    url: "https://gateway-minasa.sp.com.sa/APIGateway/api/GIS/GetDistricts",
    headers: {
      Authorization: `bearer ${spl.token}`,
    },
    data: data,
  };
  axios(config)
    .then((response) => {
      res.status(200).json({
        data: response.data,
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};
/********************************** */

var job = new CronJob(
  "00 00 00 * * *",
  async () => {
    /*
     * Runs every day
     * at 00:00:00 AM.
     */
    const spl = await Spl.findOne();
    const grant_type = "password";
    const UserName = process.env.spl_userName;
    const Password = process.env.spl_password;
    var data = qs.stringify({
      grant_type: "password",
      UserName: UserName,
      Password: Password,
    });
    var config = {
      method: "post",
      url: "https://gateway-minasa.sp.com.sa/APIGateway/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        // console.log(response.data.access_token);
        spl.token = response.data.access_token;
        return spl.save();
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  function () {
    console.log("spl token updated");
  },
  true /* Start the job right now */
);
