const axios = require("axios");
const Glt = require("../model/glt");
const GltOrder = require("../model/gltorders");
const { response } = require("express");
const { json } = require("body-parser");
exports.edit = (req, res) => {
    const status = req.body.status;
    const userprice = req.body.userprice;
    const marketerprice = req.body.marketerprice;
    const kgprice = req.body.kgprice;
    Glt.findOne()
        .then(g => {
            g.status = status;
            g.userprice = userprice;
            g.marketerprice = marketerprice;
            g.kgprice = kgprice;
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
    const glt = await Glt.findOne();
    let ordersNum = await GltOrder.count();
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

    let data = {
        orders: [
            {
                referenceNumber: ordersNum + 1 + "gotex",
                pieces: pieces,
                description: desc,
                codAmount: 22,
                paymentType: "COD",
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
                sender: sender,
                weight: weight
            },
        ]
    }
    axios({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.GLT_TOKEN,
        },
        url: 'https://devapi.gltmena.com/api/create/order',
        data: data
    })
        .then(response => {
            return response.data.data
        })
        .then(data => {
            let result = data.orders[0];
            if (result.status == 'fail') {
                res.status(400).json({
                    msg: result.msg
                })
            } else {
                const newOrder = new GltOrder({
                    user: req.user.user.id,
                    company: "glt",
                    ordernumber: ordersNum + 1,
                    data: result
                })
                return newOrder.save();
            }
        })
        .then(o => {
            res.status(200).json({
                data: o
            })
        })
        .catch(err => {
            console.log(err)
        })
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