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
        p_name, p_phone, p_line1, p_city, p_company,
        c_name, c_phone, c_line1, c_city, c_company,
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
            "plannedShippingDateAndTime": new Date(),
            "pickup": {
                "isRequested": false
            },
            "productCode": "productCode",
            "localProductCode": "",
            "getRateEstimates": false,
            "accounts": [
                {
                    "typeCode": "shipper",
                    "number": process.env.DHL_ACCOUNT_NUMBER
                }
            ],
            "valueAddedServices": [
                {
                    "serviceCode": "II",
                    "value": description,
                    "currency": "SAR"
                }
            ],
            "outputImageProperties": {
                "printerDPI": 300,
                "encodingFormat": "pdf",
                "imageOptions": [
                    {
                        "typeCode": "invoice",
                        "templateName": "COMMERCIAL_INVOICE_P_10",
                        "isRequested": true,
                        "invoiceType": "commercial",
                        "languageCode": "eng",
                        "languageCountryCode": "KSA"
                    },
                    {
                        "typeCode": "waybillDoc",
                        "templateName": "ARCH_8x4",
                        "isRequested": true,
                        "hideAccountNumber": false,
                        "numberOfCopies": 1
                    },
                    {
                        "typeCode": "label",
                        "templateName": "ECOM26_84_001",
                        "renderDHLLogo": true,
                        "fitLabelsToA4": false
                    }
                ],
                "splitTransportAndWaybillDocLabels": true,
                "allDocumentsInOneImage": false,
                "splitDocumentsByPages": false,
                "splitInvoiceAndReceipt": true,
                "receiptAndLabelsInOneImage": false
            },
            "customerDetails": {
                "shipperDetails": {
                    "postalAddress": {
                        "postalCode": "",
                        "cityName": p_city,
                        "countryCode": "KSA",
                        "addressLine1": p_line1,
                        "addressLine2": "",
                        "addressLine3": "",
                        "countyName": ""
                    },
                    "contactInformation": {
                        "email": "",
                        "phone": p_phone,
                        "mobilePhone": "",
                        "companyName": p_company,
                        "fullName": p_name
                    },
                    "registrationNumbers": [
                        {
                            "typeCode": "SSN",
                            "number": "SAR123456789",
                            "issuerCountryCode": "KSA"
                        }
                    ],
                    "typeCode": "business"
                },
                "receiverDetails": {
                    "postalAddress": {
                        "cityName": c_city,
                        "countryCode": "KSA",
                        "postalCode": "",
                        "addressLine1": c_line1,
                        "countryName": ""
                    },
                    "contactInformation": {
                        "email": "",
                        "phone": c_phone,
                        "mobilePhone": "",
                        "companyName": c_company,
                        "fullName": c_name
                    },
                    "registrationNumbers": [
                        {
                            "typeCode": "SSN",
                            "number": "SAR123456789",
                            "issuerCountryCode": "KSA"
                        }
                    ],
                    "typeCode": "business"
                }
            },
            "content": {
                "packages": [
                    {
                        "typeCode": "",
                        "weight": weight,
                        "dimensions": {
                            "length": packageLength,
                            "width": packageWidth,
                            "height": packageHeight
                        },
                        "customerReferences": [
                            {
                                "value": "3654673", // required!!
                                "typeCode": ""
                            }
                        ],
                        "description": "Piece content description",
                        "labelDescription": "bespoke label description"
                    }
                ],
                "isCustomsDeclarable": true,
                "declaredValue": 120,
                "declaredValueCurrency": "SAR",
                "exportDeclaration": {
                    "lineItems": [
                        {
                            "number": quantity,
                            "description": description,
                            "price": codAmount,
                            "quantity": {
                                "value": quantity,
                                "unitOfMeasurement": "KG"
                            },
                            "exportReasonType": "permanent",
                            "manufacturerCountry": "KSA",
                            "exportControlClassificationNumber": "SA123456789",
                            "weight": {
                                "netValue": weight,
                                "grossValue": weight
                            }
                        }
                    ],
                    "invoice": {
                        "number": "",
                        "date": new Date()
                    },
                    "remarks": [
                        {
                            "value": "Right side up only"
                        }
                    ],
                    "additionalCharges": [
                        {
                            "value": 10,
                            "caption": "fee",
                            "typeCode": "freight"
                        },
                        {
                            "value": 20,
                            "caption": "freight charges",
                            "typeCode": "other"
                        },
                        {
                            "value": 10,
                            "caption": "ins charges",
                            "typeCode": "insurance"
                        },
                        {
                            "value": 7,
                            "caption": "rev charges",
                            "typeCode": "reverse_charge"
                        }
                    ],
                    "destinationPortName": "New York Port",
                    "placeOfIncoterm": "ShenZhen Port",
                    "payerVATNumber": "12345ED",
                    "recipientReference": "01291344",
                    "exporter": {
                        "id": "121233",
                        "code": "S"
                    },
                    "packageMarks": "Fragile glass bottle",
                    "declarationNotes": [
                        {
                            "value": "up to three declaration notes"
                        }
                    ],
                    "exportReference": "export reference",
                    "exportReason": "export reason",
                    "exportReasonType": "permanent",
                    "licenses": [
                        {
                            "typeCode": "export",
                            "value": "123127233"
                        }
                    ],
                    "shipmentType": "personal",
                    "customsDocuments": [
                        {
                            "typeCode": "INV",
                            "value": "MyDHLAPI - CSAROC-001"
                        }
                    ]
                },
                "description": "Shipment",
                "USFilingTypeValue": "12345",
                "incoterm": "DAP",
                "unitOfMeasurement": "metric"
            },
            "estimatedDeliveryDate": {
                "isRequested": false,
                "typeCode": "QDDC"
            },
            "getAdditionalInformation": [
                {
                    "isRequested": false,
                    "typeCode": "pickupDetails"
                }
            ]
        })

        const config = {
            method: 'POST',
            // url: 'https://api-mock.dhl.com/mydhlapi/test/shipments',
            url: 'https://express.api.dhl.com/mydhlapi/test/shipments',
            headers: {
                'content-type': 'application/json',
                'Authorization': process.env.DHL_TOKEN
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
            paytype: paytype,
            price: totalShipPrice,
            marktercode: markterCode,
            created_at: new Date()
        })
        const myOrder = await Order.create({
            _id: order._id,
            user: userId,
            company: "dhl",
            ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
            data: response.data,
            paytype: paytype,
            price: totalShipPrice,
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
            data: order
        })
    } catch (err) {
        console.log('err')
        console.log(err)
        res.status(500).json({
            error: err.message
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