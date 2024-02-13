const axios = require("axios");
const qs = require('qs');
const Glt = require("../model/glt");
const GltOrder = require("../model/gltorders");
const User = require("../model/user");
const { createClientInvoice } = require("../modules/daftra");
const base64 = require('base64topdf');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Clint = require("../model/clint");
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
    const markterCode = req.body.markterCode || '';
    Glt.findOne()
        .then(g => {
            g.status = status;
            g.userprice = userprice;
            g.marketerprice = marketerprice;
            g.kgprice = kgprice;
            g.maxcodmarkteer = maxcodmarkteer;
            g.mincodmarkteer = mincodmarkteer;
            g.codprice = userCodPrice
            return g.save()
        })
        .then(g => {
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
    let ordersNum = await GltOrder.count();
    const userId = req.user.user.id
    const userPromise = User.findById(userId);
    const totalShipPrice = res.locals.totalShipPrice;
    /************************** */
    const pieces = req.body.pieces;
    const desc = req.body.description;
    const comment = req.body.clintComment;
    const value = req.body.value;
    const weight = req.body.weight;
    /*************************** */
    const s_address = req.body.s_address;
    const s_city = req.body.s_city;
    const s_mobile = req.body.s_mobile;
    const sender = req.body.s_name;
    /************************* */
    const c_name = req.body.c_name;
    const c_address = req.body.c_address;
    const c_areaName = req.body.c_areaName;
    const c_city = req.body.c_city;
    const c_mobile = req.body.c_mobile;
    const clintid = req.body.clintid;
    const daftraid = req.body.daftraid;
    /**************************** */
    const cod = req.body.cod;

    try {
        if (cod) {
            var paymentType = "COD";
            var codAmount = res.locals.codAmount;
            var paytype = "cod";
        } else {
            var paymentType = "CC";
            var codAmount = null;
            var paytype = "cc";
        }
        if (marktercode) {
            var nameCode = `${sender} (${marktercode})`;
        } else {
            var nameCode = sender;
        }

        let data = {
            orders: [
                {
                    referenceNumber: ordersNum + Date.now() + "gotex",
                    pieces: pieces,
                    description: desc,
                    codAmount: codAmount,
                    paymentType: paymentType,
                    clintComment: comment,
                    value: value,
                    senderInformation: {
                        address: s_address,
                        city: {
                            name: s_city
                        },
                        contactNumber: s_mobile
                    },
                    customer: {
                        name: c_name,
                        customerAddresses: {
                            address: c_address,
                            areaName: c_areaName,
                            city: {
                                name: c_city
                            },
                        },
                        mobile1: c_mobile
                    },
                    sender: nameCode,
                    weight: weight
                },
            ]
        }
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.GLT_TOKEN,
            },
            url: 'https://devapi.gltmena.com/api/create/order',
            data: data
        }
        const responsePromise = axios(config)
        const [user, response] = await Promise.all([userPromise, responsePromise])

        const order = await GltOrder.create({
            user: userId,
            company: "glt",
            ordernumber: ordersNum + 1,
            paytype: paytype,
            data: result,
            price: totalShipPrice,
            codPrice: res.locals.codAmount,
            marktercode: markterCode,
            created_at: new Date(),
            invoice: ""
        })
        const myOrder = await Order.create({
            _id: order._id,
            user: userId,
            company: "glt",
            ordernumber: ordersNum + 1,
            paytype: paytype,
            data: result,
            price: totalShipPrice,
            codPrice: res.locals.codAmount,
            marktercode: markterCode,
            created_at: new Date(),
            invoice: "",
        })

        let result = response.data.data.orders[0]; // !Note: check this again
        console.log("****")
        console.log(result)
        if (result.status == 'fail') {
            order.status = 'failed'
            await Promise.all([order.save(), myOrder.save()])

            res.status(400).json({
                msg: result.msg
            })
        }

        let invo = ""
        if (daftraid) {
            invo = await createClientInvoice(daftraid, req.user.user.daftraid, desc, paytype, totalShipPrice, pieces);
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
                company: "glt",
                id: order._id
            }
            clint.orders.push(co);

            order.marktercode = clint.marktercode ? clint.marktercode : markterCode;
            await clint.save()
        }
        if (!cod) {
            const ccOrderPayObj = { clintid, clint, totalShipPrice, user, companyName: 'glt' }
            ccOrderPay(ccOrderPayObj)
        }

        // myOrder.billCode= response.data.orderTrackingNumber // TODO : test it
        await Promise.all([order.save(), myOrder.save()]);
        res.status(200).json({
            msg: "order created successfully",
            data: order,
            clientData: {
                wallet: clint.wallet,
                package: clint.package
            }
        })
    } catch (err) {
        console.log(err)
    }
}
exports.getAllCities = (req, res) => {
    let data = {
        "id": 39
    }
    axios({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.GLT_TOKEN,
        },
        url: 'https://devapi.gltmena.com/api/get/all/cities',
        data: data
    })
        .then(response => {
            res.status(200).json({
                data: response.data
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: err
            })
        })
}
exports.getUserOrders = async (req, res) => {
    const userId = req.user.user.id;
    GltOrder.find({ user: userId, status: { $ne: "failed" } }).sort({ created_at: -1 })
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
    GltOrder.findById(orderId)
        .then(o => {
            var data = qs.stringify({
                'orderid': o.data.orderTrackingNumber
            });
            var config = {
                method: 'post',
                url: 'https://devapi.gltmena.com/api/get/awb',
                headers: {
                    'Authorization': process.env.GLT_TOKEN,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                responseType: 'arraybuffer',
                data: data
            };
            axios(config)
                .then(response => {
                    base64.base64Decode(response.data, `public/gltAwb/${orderId}.pdf`)
                    res.status(200).json({
                        msg: "ok",
                        data: `/gltAwb/${orderId}.pdf`
                    })
                    setTimeout(() => { fs.unlink(`public/gltAwb/${orderId}.pdf`, () => { }) }, 30 * 60 * 1000);
                })
        })
        .catch(err => {
            console.log(err)
            res.status(5000).json({
                msg: err
            })
        })
}