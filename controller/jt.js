const axios = require("axios");
const User = require("../model/user");
const Jt = require("../model/jt");
const JtOrder = require("../model/jtorders");
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
    const markterCode = req.body.markterCode;
    const user = await User.findById(req.user.user.id);
    const totalShipPrice = res.locals.totalShipPrice;
    /***************** */
    let { description, weight, re_address, re_city, re_mobile, re_name, re_prov, goodsType, s_address, s_city, s_mobile, s_name, s_prov, goodsValue, items, cod } = req.body;
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
        "customerCode":"J0086024173",
        "digest":"VdlpKaoq64AZ0yEsBkvt1A==",
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
        "txlogisticId":"${1695119354337}Gotex",
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
    let myText = bizContent + "a0a1047cce70493c9d5d29704f05d0d9";
    var md5Hash = crypto.createHash('md5').update(myText).digest('base64');
    let config = {
        method: 'post',
        url: 'https://demoopenapi.jtjms-sa.com/webopenplatformapi/api/order/addOrder?uuid=7a73e66f9b9c42b18d986f581e6f931e',
        headers: {
            'apiAccount': '292508153084379141',
            'digest': md5Hash,
            'timestamp': '1638428570653',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };
    try {
        const response = await axios(config);
        // console.log(response)
        if (response.data.code != 1) {
            return res.status(400).json({
                msg: response.data
            })
        }
        const newOrder = new JtOrder({
            user: req.user.user.id,
            company: "jt",
            ordernumber: ordersNum + 2,
            paytype: paytype,
            data: response.data,
            price: totalShipPrice,
            marktercode: markterCode,
            createdate: new Date(),
            // inovicedaftra: invo
        })
        await newOrder.save();
        if (!cod) {
            user.wallet = user.wallet - totalShipPrice;
            await user.save()
        }
        return res.status(200).json({
            data: newOrder
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        })
    }
}
exports.getSticker = async (req, res) => {
    const oId = req.params.oId;
    const order = await JtOrder.findById(oId);
    const billCode = order.data.data.billCode;
    try {
        const bizContent = `{
            "customerCode":"J0086024173",
            "digest":"VdlpKaoq64AZ0yEsBkvt1A==",
            "billCode":"${billCode}"
         }`;
        let myText = bizContent + "a0a1047cce70493c9d5d29704f05d0d9";
        var md5Hash = crypto.createHash('md5').update(myText).digest('base64');
        let data = qs.stringify({
            bizContent: bizContent
        });
        let config = {
            method: 'post',
            url: 'https://demoopenapi.jtjms-sa.com/webopenplatformapi/api/order/printOrder?uuid=7a73e66f9b9c42b18d986f581e6f931e',
            headers: {
                'apiAccount': '292508153084379141',
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
            error: error
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
            "customerCode":"J0086024173",
            "digest":"VdlpKaoq64AZ0yEsBkvt1A==",
            "orderType":"2",
            "txlogisticId":"${txlogisticId}",
            "reason":"We no longer needs this order.",
            "billCode":"${billCode}"
         }`;

        let data = qs.stringify({ bizContent });
        let myText = bizContent + "a0a1047cce70493c9d5d29704f05d0d9";
        var md5Hash = crypto.createHash('md5').update(myText).digest('base64');

        let config = {
            method: 'post',
            url: 'https://demoopenapi.jtjms-sa.com/webopenplatformapi/api/order/cancelOrder?uuid=7a73e66f9b9c42b18d986f581e6f931e',
            headers: {
                'apiAccount': '292508153084379141',
                'digest': md5Hash,
                'timestamp': '1638428570653',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        const response = await axios(config);
        if (response.data.code != 1) {
            return res.status(400).json({ data: response.data })
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

    JtOrder.find({ user: userId })
        .then(order => {
            res.status(200).json({
                data: order
            })
        })
        .catch(err => {
            console.log(err.request)
        })
}