const User = require("../model/user");
const Imile = require("../model/imile");
const ImileOrder = require("../model/imileorders");
const ImileClient = require("../model/imileclients");
const Clint = require("../model/clint");
const axios = require("axios");
const cron = require('node-cron');
const { createClientInvoice } = require("../modules/daftra");
const imileorders = require("../model/imileorders");
const { editImileClient } = require("./clients/imileClients");
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
    Imile.findOne()
        .then(a => {
            console.log(a)
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
exports.addClient = async (req, res) => {
    let { companyName, contacts, city, address, phone,
        backupPhone = "", attentions } = req.body;

    try {
        const imile = await Imile.findOne();

        let data = JSON.stringify({
            "customerId": process.env.imile_customerid,
            "sign": process.env.imile_sign,
            "accessToken": imile.token,
            "signMethod": "SimpleKey",
            "format": "json",
            "version": "1.0.0",
            "timestamp": "1647727143355",
            "timeZone": "+4",
            "param": {
                "companyName": companyName,
                "contacts": contacts,
                "country": "KSA",
                "city": city,
                "area": "",
                "address": address,
                "phone": phone,
                "email": "",
                "backupPhone": "",
                "attentions": attentions,
                "defaultOption": "0"
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://openapi.52imile.cn/client/consignor/add',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const addRes = await axios(config);
        if (addRes.data.message !== 'success') {
            return res.status(400).json({
                msg: addRes.data
            })
        }
        const newC = new ImileClient({
            companyName: companyName,
            contacts: contacts,
            city: city,
            address: address,
            phone: phone,
            backupPhone: backupPhone,
            attentions: attentions
        })
        const c = await newC.save();
        res.status(200).json({
            data: c
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
}

exports.createOrder = async (req, res) => {
    console.time('block')
    const imile = await Imile.findOne();
    let ordersNumPromise = ImileOrder.count();
    const userId = req.user.user.id
    const userPromise = User.findById(userId);
    const totalShipPrice = res.locals.totalShipPrice;
    //*************************** */
    const p_company = req.body.p_company;
    // front send p_city,p_address in case of choosing another client branch
    const p_city = req.body.p_city || '';
    const p_address = req.body.p_address || '';

    const p_mobile = req.body.p_mobile || ''; // front send p_mobile in case of in case of using another mobile number
    //***************************************** */
    const token = Imile.token;
    const c_company = req.body.c_company;
    const c_name = req.body.c_name;
    const c_mobile = req.body.c_mobile;
    const c_city = req.body.c_city;
    // const c_area = req.body.c_area;
    const c_street = req.body.c_street;
    const c_address = req.body.c_address;
    // const c_zipcode = req.bode.c_zipcode;
    //**************************************** */
    const markterCode = req.body.markterCode || '';
    const desc = req.body.description;
    const cod = req.body.cod;
    const goodsValue = req.body.goodsValue;
    const skuName = req.body.skuName;
    const skuDetailList = req.body.skuDetailList;
    const weight = req.body.weight;
    if (cod) {
        var codAmount = res.locals.codAmount;
        var PaymentType = "p";
        var paymentMethod = 100;
        var paytype = 'cod'
    } else {
        var codAmount = 0;
        var PaymentType = "P";
        var paymentMethod = 200;
        var paytype = 'cc'
    }
    // if (markterCode) {
    //     var nameCode = `${p_name} (${markterCode})`;
    // } else {
    //     var nameCode = p_name;
    // }
    /*************************************** */
    const daftraid = req.body.daftraid;
    const clintid = req.body.clintid;
    const shipmentDate = Date.now();

    try {
        var data = JSON.stringify({
            "customerId": process.env.imile_customerid,
            "sign": process.env.imile_sign,
            "accessToken": imile.token,
            "signMethod": "SimpleKey",
            "format": "json",
            "version": "1.0.0",
            "timestamp": 1648883951481,
            "timeZone": "+4",
            "param": {
                "orderCode": `gotex#${Date.now()}`,
                "orderType": "100",
                "consignor": p_company,
                "consignee": c_company,
                "consigneeContact": c_name,
                "consigneePhone": c_mobile,
                "consigneeCountry": "KSA",
                "consigneeProvince": "",
                "consigneeCity": c_city, // c_city
                "consigneeArea": "", //c_area
                "consigneeSuburb": "",
                "consigneeZipCode": "",
                "consigneeStreet": c_street,
                "consigneeExternalNo": "",
                "consigneeInternalNo": "",
                "consigneeAddress": c_address,
                "goodsValue": goodsValue,
                "collectingMoney": codAmount,
                "paymentMethod": paymentMethod,
                "totalCount": 1,
                "totalWeight": weight,
                "totalVolume": 0,
                "skuTotal": skuDetailList.length,
                "skuName": skuName,
                "deliveryRequirements": "",
                "orderDescription": "",
                "buyerId": "",
                "platform": "",
                "isInsurance": 0,
                "pickDate": `2023-01-29`,
                "pickType": "0",
                "batterType": "Normal",
                "currency": "Local",
                "isSupportUnpack": 1,
                "consignorJoinFrom": "FC",
                "returnAddressInfo": {
                    "contactCompany": "gotex"
                },
                "skuDetailList": skuDetailList
            }
        });

        let sender = {
            company: p_company,

            city: p_city,
            address: p_address,
            mobile: p_mobile,
        }

        const receiver = {
            name: c_name,
            mobile: c_mobile,
            city: c_city,
            address: c_address,
            street: c_street,
            company: c_company
        }

        var config = {
            method: 'post',
            url: 'https://openapi.52imile.cn/client/order/createOrder',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const responsePromise = axios(config)
        const [ordersNum, user, response] = await Promise.all([ordersNumPromise, userPromise, responsePromise])

        const order = await ImileOrder.create({
            user: userId,
            company: "imile",
            ordernumber: ordersNum + 2,
            data: response.data,
            sender,
            receiver,
            paytype: "cod",
            price: totalShipPrice,
            codPrice: res.locals.codAmount,
            weight: weight,
            marktercode: markterCode,
            created_at: new Date()
        })
        const myOrder = await Order.create({
            _id: order._id,
            user: userId,
            company: "imile",
            ordernumber: ordersNum + 2,
            data: response.data,
            sender,
            receiver,
            paytype: "cod",
            price: totalShipPrice,
            codPrice: res.locals.codAmount,
            weight: weight,
            marktercode: markterCode,
            created_at: new Date()
        })

        if (response.data.code != '200') {
            order.status = myOrder.status = 'failed'
            await Promise.all([order.save(), myOrder.save()])

            return res.status(400).json({
                msg: response.data
            })
        }

        let invo = ""
        if (daftraid) {
            invo = await createClientInvoice(daftraid, req.user.user.daftraid, desc, paytype, totalShipPrice, goodsValue);
            if (invo.result != 'successful') {
                invo = { result: "failed", daftra_response: invo }
            }
        } else {
            invo = { result: "failed", msg: "daftraid for client is required to create daftra invoice" }
        }
        order.inovicedaftra = invo
        myOrder.inovicedaftra = invo

        let clint = {}
        if (clintid) {
            clint = await Clint.findById(clintid);
            if (!clint) {
                return res.status(400).json({ error: "Client not found" })
            }
            const co = {
                company: "imile",
                id: order._id
            }
            clint.orders.push(co);

            order.marktercode = clint.marktercode ? clint.marktercode : markterCode;
            await clint.save()

            sender = {
                name: clint.name,
                street: clint.street,
                company: clint.company,

                city: p_city || clint.city,
                address: p_address || clint.address,
                mobile: p_mobile || clint.mobile,
            }

            order.sender = myOrder.sender = sender
        }
        if (!cod) {
            const ccOrderPayObj = { clintid, clint, totalShipPrice, user, companyName: 'imile' }
            ccOrderPay(ccOrderPayObj)
        }

        myOrder.billCode = response.data.data.expressNo
        await Promise.all([order.save(), myOrder.save()])
        console.timeEnd('block')
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
            msg: err.message
        })
    }
}
exports.getSticker = async (req, res) => {
    const orderId = req.params.id;

    try {
        const imile = await Imile.findOne();
        const order = await ImileOrder.findById(orderId)
        if (!order) {
            return res.status(400).json({ msg: 'Order not found' })
        }
        const orderCodeNo = order.data.data.expressNo
        console.log(orderCodeNo)

        const data = JSON.stringify({
            "customerId": process.env.imile_customerid,
            "sign": process.env.imile_sign,
            "accessToken": imile.token,
            "signMethod": "SimpleKey",
            "format": "json",
            "version": "1.0.0",
            "timestamp": 1648883951481,
            "timeZone": "+4",
            "param": {
                "customerId": process.env.imile_customerid,
                "orderCodeList": [
                    orderCodeNo
                ],
                "orderCodeType": 2
            }
        })

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            url: `https://openapi.52imile.cn/client/order/batchRePrintOrder`,
            data: data
        }

        const response = await axios(config)
        if (response.data.message !== 'success') {
            return res.status(400).json({ msg: response.data })
        }
        // return res.status(200).redirect(response.data.data[0].label)
        return res.status(200).json({ billUrl: response.data.data[0].label })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err.message
        })
    }
}

exports.cancelOrder = async (req, res) => {
    const { orderId, cancelReason = "" } = req.body;
    const userId = req.user.user.id
    const imile = await Imile.findOne();
    const order = await ImileOrder.findById(orderId)

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

        const waybillNo = order.data.data.expressNo

        const data = JSON.stringify({
            "customerId": process.env.imile_customerid,
            "sign": process.env.imile_sign,
            "accessToken": imile.token,
            "signMethod": "SimpleKey",
            "format": "json",
            "version": "1.0.0",
            "timestamp": 1648883951481,
            "timeZone": "+4",
            "param": {
                "waybillNo": waybillNo
            }
        })

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            url: `https://openapi.52imile.cn/client/order/deleteOrder`,
            data: data
        }

        const response = await axios(config)
        if (response.data.message !== 'success') {
            return res.status(400).json({ msg: response.data })
        }

        order.status = 'canceled'
        order.cancelReason = cancelReason
        await order.save()
        return res.status(200).json({ data: response.data })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err.message
        })
    }
}

exports.getAllClients = (req, res) => {
    ImileClient.find()
        .then(c => {
            res.status(200).json({
                data: c
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err.message
            })
        })
}
exports.editClient = async (req, res) => {
    const clientId = req.params.id
    const { companyName, contacts, city, address, phone, attentions } = req.body;

    try {
        const imileResult = await editImileClient(companyName, contacts, city, address, phone, attentions);
        if (imileResult != 1) {
            return res.status(400).json({ msg: imileResult })
        }

        const updatedClient = await ImileClient.findOneAndUpdate(
            { _id: clientId },
            {
                companyName,
                contacts,
                city,
                address,
                phone,
                attentions
            },
            { new: true })

        if (!updatedClient) {
            res.status(404).json(`No client for this id ${clientId}`)
        }

        res.status(200).json({ data: updatedClient })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
}
/**************************************  */
cron.schedule('0 */2 * * *', async () => {
    try {
        const imile = await Imile.findOne();
        let data = JSON.stringify({
            "customerId": process.env.imile_customerid,
            "sign": process.env.imile_sign,
            "signMethod": "SimpleKey",
            "format": "json",
            "version": "1.0.0",
            "timestamp": "1647727143355",
            "timeZone": "+4",
            "param": {
                "grantType": "clientCredential"
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://openapi.52imile.cn/auth/accessToken/grant',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const tokenRes = await axios(config);
        console.log(tokenRes.data.data.accessToken)
        if (tokenRes.data.code == '200') {
            imile.token = tokenRes.data.data.accessToken;
        }
        await imile.save();
        console.log(imile)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
});
exports.getUserOrders = (req, res) => {
    const userId = req.user.user.id;
    imileorders.find({ user: userId, status: { $ne: "failed" } }).sort({ created_at: -1 })
        .then(o => {
            res.status(200).json({
                data: o
            })
        })
        .catch(err => {
            console.log(err.request)
            res.status(500).json({
                error: error.message
            })
        })
}
