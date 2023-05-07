const axios = require("axios");
const Saee = require("../model/saee");
const SaeeOrder = require("../model/saeeorders");

exports.edit = (req, res) => {
    const status = req.body.status;
    const userprice = req.body.userprice;
    const marketerprice = req.body.marketerprice;
    const kgprice = req.body.kgprice;
    Saee.findOne()
        .then(s => {
            s.status = status;
            s.userprice = userprice;
            s.marketerprice = marketerprice;
            s.kgprice = kgprice;
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
    const saee = await Saee.findOne();
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
    let cashondelivery = saee.userprice;
    let weightPrice = 1;
    if (weight > 15) {
        weightPrice = (weight - 15) * saee.kgprice;
        cashondelivery = saee.userprice + weightPrice
    }
    const data = {
        secret: process.env.SAEE_KEY,
        name: p_name,
        city: p_city,
        mobile: p_mobile,
        streetaddress: p_streetaddress,
        cashondelivery: cashondelivery,
        weight: weight,
        quantity: quantity,
        c_name: c_name,
        c_city: c_city,
        c_streetaddress: c_streetaddress,
        c_mobile: c_mobile
    }
    axios({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        url: 'https://www.k-w-h.com/deliveryrequest/new',
        data: data
    })
        .then(response => {
            if (response.data.success) {
                const order = new SaeeOrder({
                    user: req.user.id,
                    data: response.data
                })
                order.save()
                    .then(o => {
                        res.status(200).json({
                            msg: "order created",
                            data: o
                        })
                    })
            } else {
                res.status(400).json({
                    msg: response.data.error
                })
            }
        })
        .catch(err => {
            console.log(err.request)
        })
}