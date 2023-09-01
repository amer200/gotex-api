// const aramex = require('aramex-api');
const Aramex = require("../model/aramex");
const AramexOrder = require("../model/aramexorders");
const User = require("../model/user");
const axios = require("axios");
const Clint = require("../model/clint");
const Daftra = require("../modules/daftra");
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
    const userCodPrice = req.body.userCodPrice;
    const marketerprice = req.body.marketerprice;
    const mincodmarkteer = req.body.mincodmarkteer;
    const maxcodmarkteer = req.body.maxcodmarkteer;
    const kgprice = req.body.kgprice;
    Aramex.findOne()
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

exports.createOrder = async (req, res) => {
    let ordersNum = await AramexOrder.count();
    const user = await User.findById(req.user.user.id);
    const totalShipPrice = res.locals.totalShipPrice;
    /************************* */
    const c_name = req.body.c_name;
    const c_company = req.body.c_company;
    const c_email = req.body.c_email;
    const c_phone = req.body.c_phone;
    const c_PhoneNumber1Ext = req.body.c_PhoneNumber1Ext;
    const c_line1 = req.body.c_line1;
    const c_city = req.body.c_city;
    const c_CellPhone = req.body.c_CellPhone;
    const c_StateOrProvinceCode = req.body.c_StateOrProvinceCode;
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
    const markterCode = req.body.markterCode;
    const weight = req.body.weight;
    const pieces = req.body.pieces;
    const desc = req.body.description;
    const cod = req.body.cod;
    const clintid = req.body.clintid;
    if (cod) {
        var codAmount = res.locals.codAmount;
        var PaymentType = "p";
        var PaymentOptions = "ACCT"
    } else {
        var codAmount = 0;
        var PaymentType = "P";
        var PaymentOptions = "ACCT"
    }
    if (markterCode) {
        var nameCode = `${p_name} (${markterCode})`;
    } else {
        var nameCode = p_name;
    }
    /*************************************** */
    const daftraid = req.body.daftraid;
    const shipmentDate = Date.now();
    var data = JSON.stringify({
        "Shipments": [
            {
                "Reference1": "Shipment Reference",
                "Reference2": null,
                "Reference3": null,
                "Shipper": {
                    "Reference1": "www.go-tex.net",
                    "Reference2": null,
                    "AccountNumber": process.env.AR_ACCOUNT,
                    "AccountEntity": "JED",
                    "PartyAddress": {
                        "Line1": p_line1,
                        "Line2": null,
                        "Line3": "",
                        "City": p_city,
                        "StateOrProvinceCode": p_StateOrProvinceCode,
                        "PostCode": "",
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
                        "Department": null,
                        "PersonName": nameCode,
                        "Title": null,
                        "CompanyName": p_company,
                        "PhoneNumber1": p_phone,
                        "PhoneNumber1Ext": "",
                        "PhoneNumber2": "",
                        "PhoneNumber2Ext": "",
                        "FaxNumber": null,
                        "CellPhone": p_CellPhone,
                        "EmailAddress": p_email,
                        "Type": ""
                    }
                },
                "Consignee": {
                    "Reference1": null,
                    "Reference2": null,
                    "AccountNumber": process.env.AR_ACCOUNT,
                    "AccountEntity": "JED",
                    "PartyAddress": {
                        "Line1": c_line1,
                        "Line2": null,
                        "Line3": null,
                        "City": c_city,
                        "StateOrProvinceCode": c_StateOrProvinceCode,
                        "PostCode": "",
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
                        "Department": null,
                        "PersonName": c_name,
                        "Title": null,
                        "CompanyName": c_company,
                        "PhoneNumber1": c_phone,
                        "PhoneNumber1Ext": "",
                        "PhoneNumber2": "",
                        "PhoneNumber2Ext": "",
                        "FaxNumber": null,
                        "CellPhone": c_CellPhone,
                        "EmailAddress": c_email,
                        "Type": ""
                    }
                },
                "ThirdParty": {
                    "Reference1": "",
                    "Reference2": "",
                    "AccountNumber": process.env.AR_ACCOUNT,
                    "PartyAddress": {
                        "Line1": "",
                        "Line2": "",
                        "Line3": "",
                        "City": p_city,
                        "StateOrProvinceCode": "",
                        "PostCode": "",
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
                        "PersonName": "gotex",
                        "Title": "",
                        "CompanyName": "",
                        "PhoneNumber1": "96656501313",
                        "PhoneNumber1Ext": "",
                        "PhoneNumber2": "",
                        "PhoneNumber2Ext": "",
                        "FaxNumber": "",
                        "CellPhone": "920013156",
                        "EmailAddress": "",
                        "Type": ""
                    }
                },
                "ShippingDateTime": `/Date(${shipmentDate}+0530)/`,
                "Comments": null,
                "PickupLocation": null,
                "OperationsInstructions": null,
                "AccountingInstrcutions": null,
                "Details": {
                    "Dimensions": null,
                    "ActualWeight": {
                        "Unit": "KG",
                        "Value": weight
                    },
                    "ChargeableWeight": {
                        "Unit": "KG",
                        "Value": weight
                    },
                    "DescriptionOfGoods": desc,
                    "GoodsOriginCountry": "SA",
                    "NumberOfPieces": pieces,
                    "ProductGroup": "DOM",
                    "ProductType": "CDS",
                    "PaymentType": 3,
                    "PaymentOptions": "",
                    "CustomsValueAmount": {
                        "CurrencyCode": "SAR",
                        "Value": 0
                    },
                    "CashOnDeliveryAmount": {
                        "CurrencyCode": "SAR",
                        "Value": codAmount
                    },
                    "InsuranceAmount": {
                        "CurrencyCode": "SAR",
                        "Value": 0
                    },
                    "CashAdditionalAmount": {
                        "CurrencyCode": "SAR",
                        "Value": 0
                    },
                    "CashAdditionalAmountDescription": null,
                    "CollectAmount": {
                        "CurrencyCode": "SAR",
                        "Value": 0
                    },
                    "Services": "",
                    "Items": null,
                    "DeliveryInstructions": null,
                    "AdditionalProperties": null,
                    "ContainsDangerousGoods": false
                },
                "Attachments": null,
                "ForeignHAWB": null,
                "TransportType ": 0,
                "PickupGUID": null,
                "Number": null,
                "ScheduledDelivery": null
            }
        ],
        "LabelInfo": {
            "ReportID": 9729,
            "ReportType": "URL"
        },
        "ClientInfo": {
            "UserName": process.env.AR_USERNAME,
            "Password": process.env.AR_PASSWORD,
            "Version": "v1.0",
            "AccountNumber": process.env.AR_ACCOUNT,
            "AccountPin": process.env.AR_PIN,
            "AccountEntity": "JED",
            "AccountCountryCode": "SA",
            "Source": 24
        }
    });
    var config = {
        method: 'post',
        url: 'https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    axios(config)
        .then(async (response) => {
            if (response.data.HasErrors) {
                res.status(400).json({
                    data: response.data
                })
            } else {
                if (cod) {
                    const invo = await Daftra.CreateInvo(daftraid, req.user.user.daftraid, desc, PaymentType, totalShipPrice);
                    const newO = new AramexOrder({
                        user: req.user.user.id,
                        company: "aramex",
                        ordernumber: ordersNum + 2,
                        data: response.data,
                        paytype: "cod",
                        price: totalShipPrice,
                        marktercode: markterCode,
                        createdate: new Date(),
                        inovicedaftra: invo
                    })
                    newO.save()
                        .then(async o => {
                            if (clintid) {
                                const clint = await Clint.findById(clintid);
                                const co = {
                                    company: "aramex",
                                    id: o._id
                                }
                                clint.wallet = clint.wallet - totalShipPrice;
                                clint.orders.push(co);
                                await clint.save();
                            }
                            res.status(200).json({
                                data: o
                            })
                        })
                } else {
                    user.wallet = user.wallet - totalShipPrice;
                    const invo = await Daftra.CreateInvo(daftraid, req.user.user.daftraid, desc, PaymentType, totalShipPrice);
                    user.save()
                        .then(u => {
                            const newO = new AramexOrder({
                                user: req.user.user.id,
                                company: "aramex",
                                ordernumber: ordersNum + 2,
                                data: response.data,
                                paytype: "cc",
                                price: totalShipPrice,
                                marktercode: markterCode,
                                createdate: new Date(),
                                inovicedaftra: invo
                            })
                            newO.save()
                                .then(async o => {
                                    if (clintid) {
                                        const clint = await Clint.findById(clintid);
                                        const co = {
                                            company: "aramex",
                                            id: o._id
                                        }
                                        clint.wallet = clint.wallet - totalShipPrice;
                                        clint.orders.push(co);
                                        await clint.save();
                                    }
                                    res.status(200).json({
                                        data: o
                                    })
                                })
                        })
                }
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