const Smsa = require("../model/smsa");
const smsaOrder = require("../model/smsaorders");
const axios = require('axios');

exports.edit = (req, res) => {
    const status = req.body.status;
    const userprice = req.body.userprice;
    const marketerprice = req.body.marketerprice;
    const kgprice = req.body.kgprice;
    Smsa.findOne()
        .then(s => {
            s.status = status;
            s.userprice = userprice;
            s.marketerprice = marketerprice;
            s.kgprice = kgprice;
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
exports.createUserOrder = (req, res) => {
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
    if (cod) {
        var cashondelivery = res.locals.codAmount;
    } else {
        var cashondelivery = 0;
    }
    // return console.log(cashondelivery)
    // return console.log(Date())
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
            "ContactName": p_name,
            "ContactPhoneNumber": p_ContactPhoneNumber,
            "Coordinates": "",
            "Country": "SA",
            "District": p_District,
            "PostalCode": "",
            "City": p_City,
            "AddressLine1": p_AddressLine1,
            "AddressLine2": p_AddressLine2
        },
        "OrderNumber": "FirstOrder001",
        "DeclaredValue": value,
        "CODAmount": cashondelivery,
        "Parcels": pieces,
        "ShipDate": "2021-01-01T08:00:00",
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