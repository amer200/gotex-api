const axios = require("axios");
const Gotex = require("../model/gotex");
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
    Gotex.findOne()
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
    const userId = req.user.user.id;
    let body = {
        recivername,
        reciveraddress,
        recivercity,
        reciverdistrict,
        reciverdistrictId,
        reciverphone,
        sendername,
        senderaddress,
        sendercity,
        senderdistrict,
        senderdistrictId,
        senderphone,
        paytype,
        price,
        pieces,
        description,
    } = req.body;
    try {
        const config = {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=utf-8" },
            url: "https://dashboard.go-tex.net/logistics-test/order/create-order",
            data: body,
        };
        const response = await axios(config);
        const myOrder = await Order.create({
            _id: response.data._id,
            user: userId,
            company: "gotex",
            ordernumber: response.data.ordernumber,
            data: response.data,
            sender: {
                sendername,
                senderaddress,
                sendercity,
                senderdistrict,
                senderdistrictId,
                senderphone
            },
            receiver: {
                recivername,
                reciveraddress,
                recivercity,
                reciverdistrict,
                reciverdistrictId,
                reciverphone,
            },
            billCode: response.data.billcode,
            paytype: paytype,
            price: price,
            codPrice: res.locals.codAmount,
            weight: weight,
            created_at: new Date(),
        });
        return res.status(200).json({
            data: response.data,
            msg: "order created"

        });

    }
    catch (e) {
        return res.status(500).json({
            msg: e,
        });
    }
}

