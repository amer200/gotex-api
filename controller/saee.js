const axios = require("axios");
const Saee = require("../model/saee");
const SaeeOrder = require("../model/saeeorders");
const User = require("../model/user");
const Clint = require("../model/clint");
const Daftra = require("../modules/daftra");


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
    const clintid = req.body.clintid;
    const daftraid = req.body.daftraid; // client daftra id
    const description = req.body.description;
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
    const data = {
        secret: process.env.SAEE_KEY_P,
        cashonpickup: 0,
        p_name: p_name,
        p_city: p_city,
        p_mobile: p_mobile,
        p_streetaddress: p_streetaddress,
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
        // sendercountry: "SA"
    }
    // console.log(data)
    axios({
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        url: 'https://corporate.saeex.com/deliveryrequest/newpickup',
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
                    .then(async u => {
                        const invo = await Daftra.CreateInvo(daftraid, req.user.user.daftraid, description, paytype, totalShipPrice);
                        const order = new SaeeOrder({
                            user: req.user.user.id,
                            company: "saee",
                            ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
                            data: response.data,
                            paytype: paytype,
                            price: totalShipPrice,
                            marktercode: markterCode,
                            createdate: new Date(),
                            inovicedaftra: invo
                        })
                        order.save()
                            .then(async o => {
                                if (clintid) {
                                    const clint = await Clint.findById(clintid);
                                    const co = {
                                        company: "saee",
                                        id: o._id
                                    }
                                    clint.wallet = clint.wallet - totalShipPrice;
                                    clint.orders.push(co);
                                    await clint.save();
                                }
                                res.status(200).json({
                                    msg: "order created",
                                    data: o
                                })
                            })
                    })
            } else {
                res.status(400).json({
                    msg: response.data
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err.message
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
exports.getCities = (req, res) => {
    axios({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'secret': `${process.env.SAEE_KEY_P}`
        },
        url: `https://corporate.saeex.com/deliveryrequest/getallcities`
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
    const { orderId } = req.body;
    const userId = req.user.user.id
    const order = await SaeeOrder.findById(orderId);

    try {
        if (!order || order.user != userId) {
            return res.status(400).json({
                err: "order not found"
            })
        }
        let data = JSON.stringify({
            "waybill": order.data.waybill,
            "canceled_by": 1
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://corporate.saeex.com/deliveryrequest/cancelpickup',
            headers: {
                'secret': process.env.SAEE_KEY_P,
                'Content-Type': 'application/json',
            },
            data: data
        };

        const saeeRes = await axios.request(config);
        if (saeeRes.data.success == true) {
            order.status = 'canceled'
            await order.save()

            return res.status(200).json({ data: saeeRes.data })
        } else {
            return res.status(400).json({ data: saeeRes.data })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err.message
        })
    }
}