const axios = require("axios");
const User = require("../model/user");
const Anwan = require("../model/anwan");
const AnwanOrder = require("../model/anwanorders");
const anwanorders = require("../model/anwanorders");
const Clint = require("../model/clint");
const { createClientInvoice } = require("../modules/daftra");
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
    const markterCode = req.body.markterCode || '';
    const userId = req.user.user.id
    const userPromise = User.findById(userId);
    const totalShipPrice = res.locals.totalShipPrice;
    let { c_name, c_email, c_phone, c_city, c_address,
        s_name, s_email, s_phone, s_city, s_address,
        pieces, cod, weight, description, clintid, daftraid } = req.body

    try {
        if (cod) {
            var BookingMode = "COD"
            var codValue = res.locals.codAmount;;
            var paytype = "cod";
        } else {
            var BookingMode = "CC"
            var codValue = 0;
            var paytype = "cc";
        }
        // if (markterCode) {
        //     var nameCode = `${s_name} (${markterCode})`;
        // } else {
        //     var nameCode = s_name;
        // }
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
                "reference_id": `gotex-${ordersNum + "/" + Date.now()}`,
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
        const responsePromise = axios(config)
        const [user, response] = await Promise.all([userPromise, responsePromise])

        const order = await anwanorders.create({
            user: userId,
            company: "anwan",
            ordernumber: ordersNum + 2,
            paytype: paytype,
            data: response.data,
            price: totalShipPrice,
            marktercode: markterCode,
            created_at: new Date()
        })
        const myOrder = await Order.create({
            _id: order._id,
            user: userId,
            company: "anwan",
            ordernumber: ordersNum + 2,
            paytype: paytype,
            data: response.data,
            price: totalShipPrice,
            marktercode: markterCode,
            created_at: new Date(),
            billCode: response.data.awb_no
        })

        if (response.data.status !== 200) {
            order.status = 'failed'
            await order.save()

            return res.status(400).json({
                error: response.data
            })
        }

        let invo = ""
        if (daftraid) {
            invo = await createClientInvoice(daftraid, req.user.user.daftraid, description, BookingMode, totalShipPrice, pieces);
            if (invo.result != 'successful') {
                invo = { result: "failed", daftra_response: invo }
            }
        } else {
            invo = { result: "failed", msg: "daftraid for client is required to create daftra invoice" }
        }
        order.inovicedaftra = invo

        let clint = {}
        if (clintid) {
            clint = await Clint.findById(clintid);
            if (!clint) {
                return res.status(400).json({ error: "Client not found" })
            }
            const co = {
                company: "anwan",
                id: order._id
            }
            clint.orders.push(co);

            order.marktercode = clint.marktercode ? clint.marktercode : null;
            await clint.save()
        }
        if (!cod) {
            const ccOrderPayObj = { clintid, clint, totalShipPrice, user, companyName: 'anwan' }
            ccOrderPay(ccOrderPayObj)
        }

        await order.save()
        res.status(200).json({ data: order })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message
        })
    }
}
exports.getCities = (req, res) => {
    var data = JSON.stringify({
        "ClientInfo": {
            "UserName": process.env.AR_USERNAME,
            "Password": process.env.AR_PASSWORD,
            "Version": "v1.0",
            "AccountNumber": process.env.AR_ACCOUNT,
            "AccountPin": process.env.AR_PIN,
            "AccountEntity": "JED",
            "AccountCountryCode": "SA",
            "Source": 24
        },
        "CountryCode": "SA",
        "NameStartsWith": "",
        "State": "",
        "Transaction": {
            "Reference1": "",
            "Reference2": "",
            "Reference3": "",
            "Reference4": "",
            "Reference5": ""
        }
    });

    var config = {
        method: 'post',
        url: 'https://ws.aramex.net/ShippingAPI.V2/Location/Service_1_0.svc/json/FetchCities',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            res.status(200).json({
                data: response.data
            })
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).json({
                msg: error
            })
        });

}
exports.getSticker = (req, res) => {
    const orderId = req.params.id;
    AnwanOrder.findById(orderId)
        .then(o => {
            res.status(200).json({
                data: o.data.label_print
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                msg: error
            })
        })
}
exports.getUserOrders = (req, res) => {
    const userId = req.user.user.id;
    AnwanOrder.find({ user: userId, status: { $ne: "failed" } }).sort({ created_at: -1 })
        .then(o => {
            res.status(200).json({
                data: o
            })
        })
        .catch(err => {
            console.log(err.request)
        })
}