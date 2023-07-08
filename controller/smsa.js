const Smsa = require("../model/smsa");
const SmsaOrder = require("../model/smsaorders");
const axios = require('axios');
const base64 = require('base64topdf');
const User = require("../model/user");

exports.edit = (req, res) => {
    const status = req.body.status;
    const userprice = req.body.userprice;
    const userCodPrice = req.body.userCodPrice;
    const marketerprice = req.body.marketerprice;
    const mincodmarkteer = req.body.mincodmarkteer;
    const maxcodmarkteer = req.body.maxcodmarkteer;
    const kgprice = req.body.kgprice;
    Smsa.findOne()
        .then(s => {
            s.status = status;
            s.userprice = userprice;
            s.marketerprice = marketerprice;
            s.kgprice = kgprice;
            s.maxcodmarkteer = maxcodmarkteer;
            s.mincodmarkteer = mincodmarkteer;
            s.codprice = userCodPrice
            return s.save()
        })
        .then(s => {
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
    let ordersNum = await SmsaOrder.count();
    const user = await User.findById(req.user.user.id);
    const totalShipPrice = res.locals.totalShipPrice;
    const c_name = req.body.c_name;
    const c_ContactPhoneNumber = req.body.c_ContactPhoneNumber;
    const c_ContactPhoneNumber2 = req.body.c_ContactPhoneNumber2;
    const c_District = req.body.c_District;
    const c_City = req.body.c_City;
    const c_AddressLine1 = req.body.c_AddressLine1;
    const c_AddressLine2 = req.body.c_AddressLine2;
    const p_name = req.body.p_name;
    const p_ContactPhoneNumber = req.body.p_ContactPhoneNumber;
    const p_District = req.body.p_District;
    const p_City = req.body.p_City;
    const p_AddressLine1 = req.body.p_AddressLine1;
    const p_AddressLine2 = req.body.p_AddressLine2;
    const pieces = req.body.pieces;
    const weight = req.body.weight;
    const description = req.body.description;
    const value = req.body.Value;
    const cod = req.body.cod;
    const markterCode = req.body.markterCode;
    if (cod) {
        var cashondelivery = res.locals.codAmount;
        var paytype = "cod";
    } else {
        var cashondelivery = 0;
        var paytype = "p";
    }
    if (markterCode) {
        var nameCode = `${p_name} (${markterCode})`;
    } else {
        var nameCode = p_name;
    }
    const date = new Date().toISOString().split('T')[0];
    var data = JSON.stringify({
        "ConsigneeAddress": {
            "ContactName": c_name,
            "ContactPhoneNumber": c_ContactPhoneNumber,
            "ContactPhoneNumber2": c_ContactPhoneNumber2,
            "Coordinates": "",
            "Country": "SA",
            "District": c_District,
            "PostalCode": "",
            "City": c_City,
            "AddressLine1": c_AddressLine1,
            "AddressLine2": c_AddressLine2
        },
        "ShipperAddress": {
            "ContactName": nameCode,
            "ContactPhoneNumber": p_ContactPhoneNumber,
            "Coordinates": "",
            "Country": "SA",
            "District": p_District,
            "PostalCode": "",
            "City": p_City,
            "AddressLine1": p_AddressLine1,
            "AddressLine2": p_AddressLine2
        },
        "OrderNumber": "FirstOrder001", /// code 
        "DeclaredValue": value,
        "CODAmount": cashondelivery,
        "Parcels": pieces,
        "ShipDate": `${date}`,
        "ShipmentCurrency": "SAR",
        "SMSARetailID": "0",
        "WaybillType": "PDF",
        "Weight": weight,
        "WeightUnit": "KG",
        "ContentDescription": description,
        "VatPaid": true,
        "DutyPaid": false
    });

    var config = {
        method: 'post',
        url: 'https://ecomapis.smsaexpress.com/api/shipment/b2c/new',
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SMSA_API_KEY
        },
        data: data
    };
    axios(config)
        .then(function (response) {
            if (response.status == 200) {
                const o = new SmsaOrder({
                    user: req.user.user.id,
                    company: "smsa",
                    ordernumber: ordersNum + 1,
                    data: response.data,
                    paytype: paytype,
                    marktercode: markterCode,
                    createdate: new Date()
                })
                base64.base64Decode(response.data.waybills[0].awbFile, `public/smsaAwb/${ordersNum + 1}.pdf`);
                o.save()
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
            } else {
                res.status(400).json({
                    msg: response.data
                })
            }
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).json({
                msg: error
            })
        });

}
exports.getUserOrders = (req, res) => {
    const userId = req.user.user.id;
    SmsaOrder.find({ user: userId })
        .then(o => {
            res.status(200).json({
                data: o
            })
        })
        .catch(err => {
            console.log(err.request)
        })
}
exports.getSticker = (req, res) => {
    const orderId = req.params.id;
    SmsaOrder.findById(orderId)
        .then(o => {
            res.status(200).json({
                msg: "ok",
                data: `/smsaAwb/${o.ordernumber}.pdf`
            })
        })
}