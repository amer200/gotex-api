const axios = require("axios");
const User = require("../model/user");
const { createClientInvoice } = require("../modules/daftra");
const Jt = require("../model/jt");
const JtOrder = require("../model/jtorders");
const Clint = require("../model/clint");
var crypto = require('crypto');
const qs = require('qs');
const fs = require("fs");
const base64 = require('base64topdf');
exports.edit = (req, res) => {
    const status = req.body.status;
    const userprice = req.body.userprice;
    const userCodPrice = req.body.userCodPrice;
    const marketerprice = req.body.marketerprice;
    const mincodmarkteer = req.body.mincodmarkteer;
    const maxcodmarkteer = req.body.maxcodmarkteer;
    const kgprice = req.body.kgprice;
    Jt.findOne()
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
    let ordersNum = await JtOrder.count();
    const markterCode = req.body.markterCode || '';
    const user = await User.findById(req.user.user.id);
    const totalShipPrice = res.locals.totalShipPrice;
    /***************** */
    let { description, weight, re_address, re_city, re_mobile, re_name, re_prov, goodsType,
        s_address, s_city, s_mobile, s_name, s_prov, goodsValue, items, cod, daftraid, clintid } = req.body;
    /***************** */
    if (cod) {
        var BookingMode = "COD"
        var codValue = res.locals.codAmount;;
        var paytype = "cod";
    } else {
        var BookingMode = "CC"
        var codValue = 0;
        var paytype = "cc";
    }
    if (markterCode) {
        var nameCode = `${s_name} (${markterCode})`;
    } else {
        var nameCode = s_name;
    }
    const bizContent = `{
        "customerCode":"${process.env.jt_customer_code}",
        "digest":"${process.env.jt_body_digest}",
        "serviceType":"01",
        "orderType":"2",
        "deliveryType":"04",
        "countryCode":"KSA",
        "receiver":{
           "address":"${re_address}",
           "street":"",
           "city":"${re_city}",
           "mobile":"${re_mobile}",
           "mailBox":"",
           "phone":"",
           "countryCode":"KSA",
           "name":"${re_name}",
           "company":" ",
           "postCode":"",
           "prov":"${re_prov}"
        },
        "expressType":"EZKSA",
        "length":0,
        "weight":${weight},
        "remark":"${description}",
        "txlogisticId":"${1695119354339}Gotex",
        "goodsType":"${goodsType}",
        "priceCurrency":"SAR",
        "totalQuantity":${items.length},
        "sender":{
           "address":"${s_address}",
           "street":"",
           "city":"${s_city}",
           "mobile":"${s_mobile}",
           "mailBox":"",
           "phone":"",
           "countryCode":"KSA",
           "name":"${nameCode}",
           "company":"",
           "postCode":"",
           "prov":"${s_prov}"
        },
        "itemsValue":${codValue},
        "offerFee":0,
        "items":${JSON.stringify(items)},
        "operateType":1,
        "payType":"PP_PM",
        "isUnpackEnabled":0
     }`;
    let data = qs.stringify({
        bizContent: bizContent
    });
    let myText = bizContent + process.env.jt_privte_key;
    var md5Hash = crypto.createHash('md5').update(myText).digest('base64');
    let config = {
        method: 'post',
        url: 'https://openapi.jtjms-sa.com/webopenplatformapi/api/order/addOrder',
        headers: {
            'apiAccount': process.env.jt_api_account,
            'digest': md5Hash,
            'timestamp': '1638428570653',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };
    try {
        const response = await axios(config);
        console.log('********')
        console.log(response.data.code)
        const order = new JtOrder({
            user: req.user.user.id,
            company: "jt",
            ordernumber: ordersNum + 2,
            paytype: paytype,
            data: response.data,
            price: totalShipPrice,
            marktercode: markterCode,
            createdate: new Date(),
            created_at: new Date()
        })

        if (response.data.code != 1) {
            order.status = 'failed'
            await order.save()

            return res.status(400).json({
                msg: response.data
            })
        }

        let invo = ""
        if (daftraid) {
            invo = await createClientInvoice(daftraid, req.user.user.daftraid, description, paytype, totalShipPrice, goodsValue);
            if (invo.result != 'successful') {
                invo = { result: "failed", daftra_response: invo }
            }
        } else {
            invo = { result: "failed", msg: "daftraid for client is required to create daftra invoice" }
        }
        order.inovicedaftra = invo

        if (clintid) {
            const clint = await Clint.findById(clintid);
            const co = {
                company: "jt",
                id: order._id
            }
            clint.wallet = clint.wallet - totalShipPrice;
            clint.orders.push(co);
            await clint.save();

            order.marktercode = clint.marktercode ? clint.marktercode : null;
        }
        if (!cod) {
            user.wallet = user.wallet - totalShipPrice;
            await user.save()
        }

        await order.save();
        return res.status(200).json({ data: order })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
}
exports.getSticker = async (req, res) => {
    const oId = req.params.oId;
    const order = await JtOrder.findById(oId);
    const billCode = order.data.data.billCode;
    try {
        const bizContent = `{
            "customerCode":"${process.env.jt_customer_code}",
            "digest":"${process.env.jt_body_digest}",
            "billCode":"${billCode}"
         }`;
        let myText = bizContent + process.env.jt_privte_key;
        var md5Hash = crypto.createHash('md5').update(myText).digest('base64');
        let data = qs.stringify({
            bizContent: bizContent
        });
        let config = {
            method: 'post',
            url: 'https://openapi.jtjms-sa.com/webopenplatformapi/api/order/printOrder',
            headers: {
                'apiAccount': process.env.jt_api_account,
                'digest': `${md5Hash}`,
                'timestamp': '1638428570653',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            responseType: 'arraybuffer',
            data: data
        };
        const response = await axios(config);
        base64.base64Decode(response.data, `public/jtAwb/${oId}.pdf`)
        res.status(200).json({
            msg: "ok",
            data: `/jtAwb/${oId}.pdf`
        })
        setTimeout(() => { fs.unlink(`public/jtAwb/${oId}.pdf`, () => { }) }, 30 * 60 * 1000);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}

exports.cancelOrder = async (req, res) => {
    const { orderId } = req.body
    const userId = req.user.user.id
    const order = await JtOrder.findById(orderId)
    try {
        if (!order || order.user != userId) {
            return res.status(400).json({
                err: "order not found"
            })
        }
        const txlogisticId = order.data.data.txlogisticId
        const billCode = order.data.data.billCode

        const bizContent = `{
            "customerCode":"${process.env.jt_customer_code}",
            "digest":"${process.env.jt_body_digest}",
            "orderType":"2",
            "txlogisticId":"${txlogisticId}",
            "reason":"We no longer needs this order.",
            "billCode":"${billCode}"
         }`;

        let data = qs.stringify({ bizContent });
        let myText = bizContent + process.env.jt_privte_key;
        var md5Hash = crypto.createHash('md5').update(myText).digest('base64');

        let config = {
            method: 'post',
            url: 'https://openapi.jtjms-sa.com/webopenplatformapi/api/order/cancelOrder',
            headers: {
                'apiAccount': process.env.jt_api_account,
                'digest': md5Hash,
                'timestamp': '1638428570653',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        const response = await axios(config);
        console.log('****')
        console.log(response)
        if (response.data.code != 1) {
            return res.status(400).json({ msg: response.data })
        }

        order.status = 'canceled'
        await order.save()

        return res.status(200).json({ data: response.data })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err.message
        })
    }
}
exports.getUserOrders = (req, res) => {
    const userId = req.user.user.id;

    JtOrder.find({ user: userId, status: { $ne: "failed" } })
        .then(order => {
            res.status(200).json({
                data: order
            })
        })
        .catch(err => {
            console.log(err.request)
        })
}