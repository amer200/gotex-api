const Aramex = require("../model/aramex");
const AramexOrder = require("../model/aramexorders");
const User = require("../model/user");
const axios = require("axios");
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
    const { c_name, c_company, c_phone, c_line1, c_city, c_CellPhone, c_StateOrProvinceCode,
        p_name, p_company, p_phone, p_line1, p_city, p_CellPhone, p_StateOrProvinceCode,
        weight, pieces, description, cod, clintid, daftraid } = req.body
    const markterCode = req.body.markterCode || '';

    try {
        const userId = req.user.user.id
        const userPromise = User.findById(userId);
        let ordersNumPromise = AramexOrder.count();
        const totalShipPrice = res.locals.totalShipPrice;

        if (cod) {
            var codAmount = res.locals.codAmount;
            var PaymentType = "p";
            var PaymentOptions = "ACCT"
            var paytype = 'cod'
        } else {
            var codAmount = 0;
            var PaymentType = "P";
            var PaymentOptions = "ACCT"
            var paytype = 'cc'
        }
        if (markterCode) {
            var nameCode = `${p_name} (${markterCode})`;
        } else {
            var nameCode = p_name;
        }

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
                            "PersonName": p_name,
                            "Title": null,
                            "CompanyName": p_company,
                            "PhoneNumber1": p_phone,
                            "PhoneNumber1Ext": "",
                            "PhoneNumber2": "",
                            "PhoneNumber2Ext": "",
                            "FaxNumber": null,
                            "CellPhone": p_CellPhone,
                            "EmailAddress": "",
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
                            "EmailAddress": "",
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
                        "DescriptionOfGoods": description,
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

        const sender = {
            name: p_name,
            mobile: p_phone,
            city: p_city,
            address: p_line1,
            province: p_StateOrProvinceCode,
            cellPhone: p_CellPhone,
            company: p_company
        }

        const receiver = {
            name: c_name,
            mobile: c_phone,
            city: c_city,
            address: c_line1,
            province: c_StateOrProvinceCode,
            cellPhone: c_CellPhone,
            company: c_company
        }

        var config = {
            method: 'post',
            url: 'https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const responsePromise = axios(config)
        const [ordersNum, user, response] = await Promise.all([ordersNumPromise, userPromise, responsePromise])

        const order = await AramexOrder.create({
            user: userId,
            company: "aramex",
            ordernumber: ordersNum + 2,
            data: response.data,
            sender,
            receiver,
            paytype,
            price: totalShipPrice,
            codPrice: res.locals.codAmount,
            weight: weight,
            marktercode: markterCode,
            created_at: new Date()
        })
        const myOrder = await Order.create({
            _id: order._id,
            user: userId,
            company: "aramex",
            ordernumber: ordersNum + 2,
            data: response.data,
            sender,
            receiver,
            paytype,
            price: totalShipPrice,
            codPrice: res.locals.codAmount,
            weight: weight,
            marktercode: markterCode,
            created_at: new Date(),
        })

        if (response.data.HasErrors) {
            order.status = 'failed'
            await Promise.all([order.save(), myOrder.save()])

            return res.status(400).json({ msg: response.data })
        }

        let invo = ""
        if (daftraid) {
            invo = await createClientInvoice(daftraid, req.user.user.daftraid, description, PaymentType, totalShipPrice, pieces);
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
                company: "aramex",
                id: order._id
            }
            clint.orders.push(co);

            order.marktercode = clint.marktercode ? clint.marktercode : markterCode;
            await clint.save()
        }
        if (!cod) {
            const ccOrderPayObj = { clintid, clint, totalShipPrice, user, companyName: 'aramex' }
            ccOrderPay(ccOrderPayObj)
        }

        myOrder.billCode = response.data.Shipments[0]["ID"]
        await Promise.all([order.save(), myOrder.save()])
        res.status(200).json({
            msg: "order created successfully",
            data: order,
            clientData: {
                package: clint.package,
                wallet: clint.wallet,
                credit: clint.credit
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err.message
        })
    }
}

exports.getUserOrders = (req, res) => {
    const userId = req.user.user.id;
    AramexOrder.find({ user: userId, status: { $ne: "failed" } }).sort({ created_at: -1 })
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