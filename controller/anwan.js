const axios = require("axios");
const User = require("../model/user");
const Anwan = require("../model/anwan");
const AnwanOrder = require("../model/anwanorders");
const anwanorders = require("../model/anwanorders");

exports.edit = (req, res) => {
    const status = req.body.status;
    const userprice = req.body.userprice;
    const userCodPrice = req.body.userCodPrice;
    const marketerprice = req.body.marketerprice;
    const mincodmarkteer = req.body.mincodmarkteer;
    const maxcodmarkteer = req.body.maxcodmarkteer;
    const kgprice = req.body.kgprice;
    Anwan.findOne()
        .then(a => {
            a.status = status;
            a.userprice = userprice;
            a.marketerprice = marketerprice;
            a.kgprice = kgprice;
            a.maxcodmarkteer = maxcodmarkteer;
            a.mincodmarkteer = mincodmarkteer;
            a.codprice = userCodPrice
            return a.save()
        })
        .then(a => {
            res.status(200).json({
                msg: "ok"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: err.message
            })
        })
}
exports.createUserOrder = async (req, res) => {
    let ordersNum = await AnwanOrder.count();
    const user = await User.findById(req.user.user.id);
    const totalShipPrice = res.locals.totalShipPrice;
    let { s_phone, s_name, s_email, c_email, description, s_city, c_phone, s_address, c_name, c_city, pieces, c_address, cod, weight } = req.body
    if (cod) {
        var BookingMode = "COD"
        var codValue = res.locals.codAmount;;
        var paytype = "cod";
    } else {
        var BookingMode = "CC"
        var codValue = 0;
        var paytype = "cc";
    }
    var data = {
        "format": "json",
        "secret_key": process.env.ANWAN_SECRET_KEY,
        "customerId": process.env.ANWAN_CUSTOMER_ID,
        "param": {
            "sender_phone": s_phone,
            "sender_name": s_name,
            "sender_email": s_email,
            "receiver_email": c_email,
            "description": description,
            "origin": s_city,
            "receiver_phone": c_phone,
            "sender_address": s_address,
            "receiver_name": c_name,
            "destination": c_city,
            "BookingMode": BookingMode,
            "pieces": pieces,
            "weight": weight,
            "receiver_address": c_address,
            "reference_id": `gotex-${ordersNum + 5}`,
            "codValue": codValue,
            "productType": "Parcel"
        }
    };
    var config = {
        method: 'post',
        url: 'https://api.fastcoo-tech.com/API_v2/CreateOrder',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    axios(config)
        .then(function (response) {
            if (response.data.status !== 200) {
                return res.status(400).json({
                    error: response.data
                })
            } else {
                const newOrder = new anwanorders({
                    user: req.user.user.id,
                    company: "anwan",
                    ordernumber: ordersNum + 2,
                    paytype: paytype,
                    data: response.data,
                    price: totalShipPrice
                })
                newOrder.save()
                    .then(o => {
                        if (!cod) {
                            user.wallet = user.wallet - totalShipPrice;
                            user.save()
                                .then(u => {
                                    res.status(200).json({
                                        data: o
                                    })
                                })
                        } else {
                            res.status(200).json({
                                data: o
                            })
                        }
                    })
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}