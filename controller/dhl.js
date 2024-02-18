const axios = require("axios");
const Dhl = require("../model/dhl");
const DhlOrder = require("../model/dhlorders");
const User = require("../model/user");
const Clint = require("../model/clint");
const { createClientInvoice, createSupplierInvoice } = require("../modules/daftra");
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
    Dhl.findOne()
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

//shipment
exports.createUserOrder = async (req, res) => {
    const {
        p_name, p_phone, p_line1, p_city, p_company, p_postalCode,
        c_name, c_phone, c_line1, c_city, c_company, c_postalCode,
        weight, quantity, packageLength, packageWidth, packageHeight, description, cod, clintid, daftraid } = req.body
    const markterCode = req.body.markterCode || '';
    const totalShipPrice = res.locals.totalShipPrice;
    const userId = req.user.user.id

    try {
        let ordersNumPromise = DhlOrder.count();
        const userPromise = User.findById(userId);
        const dhlPromise = Dhl.findOne();

        if (cod) {
            var codAmount = res.locals.codAmount;
            var paytype = "cod";
            var payMethod = "cash";
        } else {
            var codAmount = res.locals.codAmount;
            var paytype = "cc";
            var payMethod = "online";
        }

        if (markterCode) {
            var nameCode = `${p_name} (${markterCode})`;
        } else {
            var nameCode = p_name;
        }

        const data = JSON.stringify({
            "mode": "raw",
            "raw": {
                "productCode": "P",
                "plannedShippingDateAndTime": new Date(),
                "pickup": {
                    "isRequested": false
                },
                "accounts": [
                    {
                        "number": process.env.DHL_ACCOUNT_NUMBER,
                        "typeCode": "shipper"
                    }
                ],
                "outputImageProperties": {
                    "encodingFormat": "pdf",
                    "imageOptions": [
                        {
                            "invoiceType": "commercial",
                            "isRequested": true,
                            "typeCode": "invoice"
                        },
                        {
                            "hideAccountNumber": false,
                            "isRequested": true,
                            "typeCode": "waybillDoc"
                        }
                    ]
                },
                "valueAddedServices": [
                    {
                        "serviceCode": "WY"
                    }
                ],
                "customerDetails": {
                    "shipperDetails": {
                        "postalAddress": {
                            "cityName": p_city,
                            "countryCode": "KSA",
                            "postalCode": p_postalCode,
                            "addressLine1": p_line1
                        },
                        "contactInformation": {
                            "phone": p_phone,
                            "companyName": p_company,
                            "fullName": p_name
                        }
                    },
                    "receiverDetails": {
                        "postalAddress": {
                            "cityName": c_city,
                            "countryCode": "KSA",
                            "postalCode": c_postalCode,
                            "addressLine1": c_line1,
                            "countyName": "OREGON"
                        },
                        "contactInformation": {
                            "phone": c_phone,
                            "companyName": c_company,
                            "fullName": c_name,
                            "email": ""
                        }
                    }
                },
                "content": {
                    "unitOfMeasurement": "metric",
                    "incoterm": "DAP",
                    "exportDeclaration": {
                        "lineItems": [
                            {
                                "number": quantity,
                                "commodityCodes": [
                                    {
                                        "value": "33059040",
                                        "typeCode": "outbound"
                                    }
                                ],
                                "priceCurrency": "SAR",
                                "quantity": {
                                    "unitOfMeasurement": "KG",
                                    "value": quantity
                                },
                                "price": codAmount,
                                "description": "La Prairie Skin Caviar Luxe Cream 100ml",
                                "weight": {
                                    "netValue": weight,
                                    "grossValue": weight
                                },
                                "exportReasonType": "permanent",
                                "manufacturerCountry": "KSA"
                            }
                        ],
                        "invoice": {
                            "date": new Date(),
                            "number": "100299777",
                            "signatureName": "Hugh Brewman",
                            "signatureImage": "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",
                            "signatureTitle": "Systems Manager"
                        }
                    },
                    "isCustomsDeclarable": true,
                    "description": "Cosmetics: Skincare",
                    "packages": [
                        {
                            "customerReferences": [
                                {
                                    "value": "100299777"
                                }
                            ],
                            "weight": weight,
                            "dimensions": {
                                "length": packageLength,
                                "width": packageWidth,
                                "height": packageHeight
                            }
                        }
                    ],
                    "declaredValue": 1139.75,
                    "declaredValueCurrency": "SAR"
                }
            }
        });

        const sender = {
            name: p_name,
            mobile: p_phone,
            city: p_city,
            address: p_line1,
            company: p_company,
            postalCode: p_postalCode
        }

        const receiver = {
            name: c_name,
            mobile: c_phone,
            city: c_city,
            address: c_line1,
            company: c_company,
            postalCode: c_postalCode
        }

        const config = {
            method: 'POST',
            maxBodyLength: Infinity,
            // url: 'https://api-mock.dhl.com/mydhlapi/test/shipments',
            url: 'https://express.api.dhl.com/mydhlapi/test/shipments',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.DHL_TOKEN,
                'Cookie': process.env.DHL_COOKIE
            },
            data: data
        };

        const responsePromise = axios(config)
        const [user, dhl, ordersNum, response] = await Promise.all([userPromise, dhlPromise, ordersNumPromise, responsePromise])
        const order = await DhlOrder.create({
            user: userId,
            company: "dhl",
            ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
            data: response.data,
            sender,
            receiver,
            paytype: paytype,
            price: totalShipPrice,
            codPrice: res.locals.codAmount,
            marktercode: markterCode,
            created_at: new Date()
        })
        const myOrder = await Order.create({
            _id: order._id,
            user: userId,
            company: "dhl",
            ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
            data: response.data,
            sender,
            receiver,
            paytype: paytype,
            price: totalShipPrice,
            codPrice: res.locals.codAmount,
            marktercode: markterCode,
            created_at: new Date(),
        })

        if (!response.data.success) {
            order.status = 'failed'
            await Promise.all([order.save(), myOrder.save()])

            return res.status(400).json({
                msg: response.data
            })
        }

        const supplier_daftraid = dhl.daftraId
        const supplierInvoice = await createSupplierInvoice(supplier_daftraid, description, totalShipPrice, quantity);
        order.supplier_inovicedaftra = supplierInvoice

        let invo = ""
        if (daftraid) {
            invo = await createClientInvoice(daftraid, req.user.user.daftraid, description, paytype, totalShipPrice, quantity);
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
                company: "dhl",
                id: order._id
            }
            clint.orders.push(co);

            order.marktercode = clint.marktercode ? clint.marktercode : markterCode;
            await clint.save()
        }

        if (!cod) {
            const ccOrderPayObj = { clintid, clint, totalShipPrice, user, companyName: 'dhl' }
            ccOrderPay(ccOrderPayObj)
        }

        myOrder.billCode = response.data.waybill
        await Promise.all([order.save(), myOrder.save()]);
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
        console.log('err')
        console.log(err)
        res.status(500).json({
            error: err.response.data
        })
    }
}
exports.getUserOrders = async (req, res) => {
    const userId = req.user.user.id;
    DhlOrder.find({ user: userId, status: { $ne: "failed" } }).sort({ created_at: -1 })
        .then(o => {
            res.status(200).json({
                data: o
            })
        })
        .catch(err => {
            console.log(err.request)
        })
}
exports.getSticker = async (req, res) => {
    const orderId = req.params.id;

    DhlOrder.findById(orderId)
        .then(order => {
            if (!order) {
                return res.status(400).json({
                    err: "order not found"
                })
            }

            const shipmentTrackingNumber = order.data.shipmentTrackingNumber
            const pickupYearAndMonth = order.created_at.toISOString().slice(0, 7);

            axios({
                method: 'GET',
                // url: `https://api-mock.dhl.com/mydhlapi/test/shipments/${shipmentTrackingNumber}/get-image`,
                url: `https://express.api.dhl.com/mydhlapi/test/shipments/${shipmentTrackingNumber}/get-image`,
                params: {
                    shipmentTrackingNumber: shipmentTrackingNumber,
                    typeCode: 'waybill',
                    pickupYearAndMonth: pickupYearAndMonth
                },
                headers: {
                    Authorization: process.env.DHL_TOKEN
                }
            })
                .then(response => {
                    res.status(200).json({
                        msg: "ok",
                        data: response.data
                    })
                })
        })
        .catch(err => {
            console.log(err)
        })
}
exports.getAddresses = async (req, res) => {
    axios({
        method: 'GET',
        // url: 'https://api-mock.dhl.com/mydhlapi/test/address-validate',
        url: 'https://express.api.dhl.com/mydhlapi/test/address-validate',
        params: { type: 'pickup', countryCode: 'KSA' },
        headers: {
            'content-type': 'application/json',
            'Authorization': process.env.DHL_TOKEN
        }
    })
        .then(response => {
            res.status(200).json({
                data: response.data
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err.message
            })
        })
}

exports.cancelOrder = async (req, res) => {
    const { orderId, cancelReason = "" } = req.body;
    const userId = req.user.user.id
    const order = await DhlOrder.findById(orderId);

    try {
        if (!order || order.user != userId) {
            return res.status(400).json({
                err: "order not found"
            })
        }
        if (order.status == 'canceled') {
            return res.status(400).json({
                err: "This order is already canceled"
            })
        }
        // if (!cancelReason) {
        //     return res.status(400).json({
        //         err: "cancelReason is required"
        //     })
        // }

        let data = JSON.stringify({
            "waybill": order.data.waybill,
            "canceled_by": 1
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://corporate.k-w-h.com/deliveryrequest/cancelpickup',
            headers: {
                'secret': process.env.SAEE_KEY_P,
                'Content-Type': 'application/json',
            },
            data: data
        };

        const dhlRes = await axios.request(config);
        if (dhlRes.data.success == true) {
            order.status = 'canceled'
            order.cancelReason = cancelReason
            await order.save()

            return res.status(200).json({ data: dhlRes.data })
        } else {
            return res.status(400).json({ data: dhlRes.data })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err.message
        })
    }
}