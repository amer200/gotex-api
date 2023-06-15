// const aramex = require('aramex-api');
const Aramex = require("../model/aramex");
const AramexOrder = require("../model/aramexorders");
const axios = require("axios");
// exports.createOrder = async (req, res) => {
//     try {
//         clientInfo = new aramex.ClientInfo({
//             // UserName: process.env.AR_USERNAME,
//             // Password: process.env.AR_PASSWORD,
//             // Version: 'v2.0',
//             // AccountNumber: process.env.AR_ACCOUNT,
//             // AccountPin: process.env.AR_PIN,
//             // AccountEntity: 'JED',
//             // AccountCountryCode: 'SA'
//         });

//         aramex.Aramex.setClientInfo(clientInfo);

//         aramex.Aramex.setConsignee(new aramex.Consignee());

//         aramex.Aramex.setShipper(new aramex.Shipper());

//         aramex.Aramex.setThirdParty(new aramex.ThirdParty());

//         aramex.Aramex.setDetails(1);

//         aramex.Aramex.setDimension();

//         aramex.Aramex.setWeight();

//         //Creating shipment

//         let result = await aramex.Aramex.createShipment([
//             {
//                 PackageType: 'Box',
//                 Quantity: 2,
//                 Weight: {
//                     Value: 0.5,
//                     Unit: 'Kg'
//                 },
//                 Comments: 'Docs',
//                 Reference: ''
//             }
//         ]);
//         res.json({
//             result: result
//         })
//     } catch (error) {
//         console.log(error)
//     }

// }
exports.edit = (req, res) => {
    const status = req.body.status;
    const userprice = req.body.userprice;
    const marketerprice = req.body.marketerprice;
    const kgprice = req.body.kgprice;
    Aramex.findOne()
        .then(a => {
            a.status = status;
            a.userprice = userprice;
            a.marketerprice = marketerprice;
            a.kgprice = kgprice;
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

exports.createOrder = async (req, res) => {
    let ordersNum = await AramexOrder.count();
    /************************* */
    const c_name = req.body.c_name;
    const c_company = req.body.c_company;
    const c_email = req.body.c_email;
    const c_phone = req.body.c_phone;
    const c_PhoneNumber1Ext = req.body.c_PhoneNumber1Ext;
    const c_line1 = req.body.c_line1;
    const c_city = req.body.c_city;
    const c_CellPhone = req.body.c_CellPhone;
    //     /************************* */
    const p_name = req.body.p_name;
    const p_company = req.body.p_company;
    const p_email = req.body.p_email;
    const p_phone = req.body.p_phone;
    const p_PhoneNumber1Ext = req.body.p_PhoneNumber1Ext;
    const p_line1 = req.body.p_line1;
    const p_city = req.body.p_city;
    const p_CellPhone = req.body.p_CellPhone;
    const p_StateOrProvinceCode = req.body.p_StateOrProvinceCode;
    const p_postCode = req.body.p_postCode;
    //     /***************************** */
    const weight = req.body.weight;
    const pieces = req.body.pieces;
    const cod = req.body.cod;
    console.log(req.body)
    if (cod) {
        var codAmount = {
            "CurrencyCode": "SAR",
            "Value": res.locals.codAmount
        };
        var PaymentType = "P";
        var ThirdParty = null;
        // {
        //     "Reference1": "",
        //     "Reference2": "",
        //     "AccountNumber": process.env.AR_ACCOUNT,
        //     "PartyAddress": {
        //         "Line1": p_line1,
        //         "Line2": "",
        //         "Line3": "",
        //         "City": p_city,
        //         "StateOrProvinceCode": p_StateOrProvinceCode,
        //         "PostCode": p_postCode,
        //         "CountryCode": "SA",
        //         "Longitude": 0,
        //         "Latitude": 0,
        //         "BuildingNumber": null,
        //         "BuildingName": null,
        //         "Floor": null,
        //         "Apartment": null,
        //         "POBox": null,
        //         "Description": null
        //     },
        //     "Contact": {
        //         "Department": "",
        //         "PersonName": p_name,
        //         "Title": "",
        //         "CompanyName": p_company,
        //         "PhoneNumber1": p_phone,
        //         "PhoneNumber1Ext": p_PhoneNumber1Ext,
        //         "PhoneNumber2": "",
        //         "PhoneNumber2Ext": "",
        //         "FaxNumber": "",
        //         "CellPhone": p_CellPhone,
        //         "EmailAddress": p_email,
        //         "Type": ""
        //     }
        // }
    } else {
        var codAmount = null;
        var PaymentType = "P"
    }

    /*************************************** */
    const shipmentDate = Date.now();
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
        "LabelInfo": {
            "ReportID": 9729,
            "ReportType": "URL"
        },
        "Shipments": [
            {
                "Reference1": "",
                "Reference2": "",
                "Reference3": "",
                "Shipper": {
                    "Reference1": "",
                    "Reference2": "",
                    "AccountNumber": process.env.AR_ACCOUNT,
                    "AccountEntity": "JED",
                    "PartyAddress": {
                        "Line1": p_line1,
                        "Line2": "",
                        "Line3": "",
                        "City": p_city,
                        "StateOrProvinceCode": p_StateOrProvinceCode,
                        "PostCode": p_postCode,
                        "CountryCode": "SA",
                        "Longitude": 0,
                        "Latitude": 0,
                        "BuildingNumber": null,
                        "BuildingName": null,
                        "Floor": null,
                        "Apartment": null,
                        "POBox": null,
                        "Description": null
                    },
                    "Contact": {
                        "Department": "",
                        "PersonName": p_name,
                        "Title": "",
                        "CompanyName": p_company,
                        "PhoneNumber1": p_phone,
                        "PhoneNumber1Ext": p_PhoneNumber1Ext,
                        "PhoneNumber2": "",
                        "PhoneNumber2Ext": "",
                        "FaxNumber": "",
                        "CellPhone": p_CellPhone,
                        "EmailAddress": p_email,
                        "Type": ""
                    }
                },
                "Consignee": {
                    "Reference1": "",
                    "Reference2": "",
                    "AccountNumber": process.env.AR_ACCOUNT,
                    "AccountEntity": "JED",
                    "PartyAddress": {
                        "Line1": c_line1,
                        "Line2": "",
                        "Line3": "",
                        "City": c_city,
                        "StateOrProvinceCode": "",
                        "PostCode": "",
                        "CountryCode": "SA",
                        "Longitude": 0,
                        "Latitude": 0,
                        "BuildingNumber": "",
                        "BuildingName": "",
                        "Floor": "",
                        "Apartment": "",
                        "POBox": null,
                        "Description": null
                    },
                    "Contact": {
                        "Department": "",
                        "PersonName": c_name,
                        "Title": "",
                        "CompanyName": c_company,
                        "PhoneNumber1": c_phone,
                        "PhoneNumber1Ext": c_PhoneNumber1Ext,
                        "PhoneNumber2": "",
                        "PhoneNumber2Ext": "",
                        "FaxNumber": "",
                        "CellPhone": c_CellPhone,
                        "EmailAddress": c_email,
                        "Type": ""
                    }
                },
                "ThirdParty": ThirdParty,
                "ShippingDateTime": `/Date(${shipmentDate}+0530)/`,
                "Comments": "",
                "PickupLocation": "",
                "OperationsInstructions": "",
                "AccountingInstrcutions": "",
                "Details": {
                    "Dimensions": null,
                    "ActualWeight": {
                        "Unit": "KG",
                        "Value": weight
                    },
                    "ChargeableWeight": null,
                    "DescriptionOfGoods": null,
                    "GoodsOriginCountry": "IN",
                    "NumberOfPieces": pieces,
                    "ProductGroup": "EXP",
                    "ProductType": "PPX",
                    "PaymentType": PaymentType,
                    "PaymentOptions": "",
                    "CustomsValueAmount": {
                        "CurrencyCode": "SAR",
                        "Value": 200
                    },
                    "CashOnDeliveryAmount": codAmount,
                    "InsuranceAmount": null,
                    "CashAdditionalAmount": null,
                    "CashAdditionalAmountDescription": "",
                    "CollectAmount": null,
                    "Services": "",
                    "Items": [
                        {
                            "PackageType": "Box",
                            "Quantity": "1",
                            "Weight": null,
                            "CustomsValue": {
                                "CurrencyCode": "SAR",
                                "Value": 10
                            },
                            "Comments": "Ravishing Gold Facial Kit Long Lasting Shining Appearance For All Skin Type 125g",
                            "GoodsDescription": "new Gold Facial Kit Long  Shining Appearance",
                            "Reference": "",
                            "CommodityCode": "98765432"
                        }
                    ]
                },
                "Attachments": [],
                "ForeignHAWB": "",
                "TransportType ": 0,
                "PickupGUID": "",
                "Number": null,
                "ScheduledDelivery": null
            }
        ],
        "Transaction": {
            "Reference1": "",
            "Reference2": "",
            "Reference3": "",
            "Reference4": "",
            "Reference5": ""
        }
    });
    console.log(data)
    var config = {
        method: 'post',
        url: 'https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            if (response.data.HasErrors) {
                res.status(400).json({
                    data: response.data
                })
            } else {
                const newO = new AramexOrder({
                    user: req.user.user.id,
                    company: "aramex",
                    ordernumber: ordersNum + 2,
                    data: response.data
                })
                newO.save()
                    .then(o => {
                        res.status(200).json({
                            data: response.data
                        })
                    })
            }
        })
        .catch(function (error) {
            console.log(error)
            res.status(500).json({
                error: error
            })
        });


}
exports.getUserOrders = (req, res) => {
    const userId = req.user.user.id;
    AramexOrder.find({ user: userId })
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
    AramexOrder.findById(orderId)
        .then(o => {
            const url = o.data.Shipments[0].ShipmentLabel.LabelURL;
            res.status(200).json({
                data: url
            })
        })
        .catch(err => {
            console.log(err)
        })
}