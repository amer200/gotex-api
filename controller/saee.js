const axios = require("axios");
const Saee = require("../model/saee");
const SaeeOrder = require("../model/saeeorders");
const User = require("../model/user");

exports.edit = (req, res) => {
    const status = req.body.status;
    const userprice = req.body.userprice;
    const userCodPrice = req.body.userCodPrice;
    const marketerprice = req.body.marketerprice;
    const mincodmarkteer = req.body.mincodmarkteer;
    const maxcodmarkteer = req.body.maxcodmarkteer;
    const kgprice = req.body.kgprice;
    Saee.findOne()
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
exports.createUserOrder = async (req, res) => {
    const user = await User.findById(req.user.user.id);
    let ordersNum = await SaeeOrder.count();
    const p_name = req.body.p_name;
    const p_city = req.body.p_city;
    const p_mobile = req.body.p_mobile;
    const p_streetaddress = req.body.p_streetaddress;
    const weight = req.body.weight;
    const quantity = req.body.quantity;
    const c_name = req.body.c_name;
    const c_city = req.body.c_city;
    const c_streetaddress = req.body.c_streetaddress;
    const c_mobile = req.body.c_mobile;
    const cod = req.body.cod;
    const markterCode = req.body.markterCode;
    const totalShipPrice = res.locals.totalShipPrice;
    if (cod) {
        var cashondelivery = res.locals.codAmount;
        var paytype = "cod";
    } else {
        var cashondelivery = res.locals.codAmount;
        var paytype = "cc";
    }
    if (markterCode) {
        var nameCode = `${p_name} (${markterCode})`;
    } else {
        var nameCode = p_name;
    }
    // const data = {
    //     secret: process.env.SAEE_KEY_P,
    //     name: nameCode,
    //     city: p_city,
    //     mobile: p_mobile,
    //     streetaddress: p_streetaddress,
    //     cashondelivery: cashondelivery,
    //     weight: weight,
    //     quantity: quantity,
    //     c_name: c_name,
    //     c_city: c_city,
    //     c_streetaddress: c_streetaddress,
    //     c_mobile: c_mobile,
    //     ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
    //     sendername: p_name,
    //     senderphone: p_mobile,
    //     senderaddress: p_streetaddress,
    //     sendercity: p_city,
    //     sendercountry: "SA"
    // }
    const data = {
        secret: process.env.SAEE_KEY_P,
        name: c_name,
        city: c_city,
        mobile: c_mobile,
        streetaddress: c_streetaddress,
        cashondelivery: cashondelivery,
        weight: weight,
        quantity: quantity,
        c_name: c_name,
        c_city: c_city,
        c_streetaddress: c_streetaddress,
        c_mobile: c_mobile,
        ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
        sendername: nameCode,
        senderphone: p_mobile,
        senderaddress: p_streetaddress,
        sendercity: p_city,
        sendercountry: "SA"
    }
    axios({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: 'https://corporate.saeex.com/deliveryrequest/new',
        data: data
    })
        .then(response => {
            if (response.data.success) {
                if (!cod) {
                    user.wallet = user.wallet - totalShipPrice;
                } else {
                    user.wallet = user.wallet
                }
                user.save()
                    .then(u => {
                        const order = new SaeeOrder({
                            user: req.user.user.id,
                            company: "saee",
                            ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
                            data: response.data,
                            paytype: paytype,
                            price: totalShipPrice,
                            marktercode: markterCode
                        })
                        order.save()
                            .then(o => {
                                res.status(200).json({
                                    msg: "order created",
                                    data: o
                                })
                            })
                    })
            } else {
                res.status(400).json({
                    msg: response.data.error
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}
exports.getUserOrders = async (req, res) => {
    const userId = req.user.user.id;
    SaeeOrder.find({ user: userId })
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
    SaeeOrder.findById(orderId)
        .then(o => {
            axios({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'secret': `${process.env.SAEE_KEY_P}`
                },
                url: `https://corporate.saeex.com/deliveryrequest/printsticker/${o.data.waybill}`
            })
                .then(bill => {
                    res.status(200).json({
                        msg: "ok",
                        data: bill.data
                    })
                })
        })
        .catch(err => {
            console.log(err)
        })
}
exports.trakingOrderByNum = async (req, res) => {
    const orderId = req.body.orderId;
    const order = await SaeeOrder.findById(orderId);
    axios({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'secret': `${process.env.SAEE_KEY_P}`
        },
        url: `https://corporate.saeex.com/tracking/ordernumber?ordernumber=${order.ordernumber}`
    })
        .then(response => {
            res.status(200).json({
                data: response.data
            })
        })
        .catch(err => {
            console.log(err)
        })
}