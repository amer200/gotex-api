const axios = require("axios");
const User = require("../model/user");
const Jt = require("../model/jt");
const JtOrder = require("../model/jtorders");
const qs = require('qs');
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
    let data = qs.stringify({
        bizContent: {
            "customerCode": "J0086024173",
            "digest": "VdlpKaoq64AZ0yEsBkvt1A==",
            "serviceType": "01",
            "orderType": "2",
            "deliveryType": "04",
            "countryCode": "KSA",
            "receiver": {
                "address": re_address,
                "street": "",
                "city": re_city,
                "mobile": re_mobile,
                "mailBox": " ",
                "phone": " ",
                "countryCode": "KSA",
                "name": re_name,
                "company": " ",
                "postCode": " ",
                "prov": re_prov
            },
            "expressType": "EZKSA",
            "length": 0,
            "weight": weight,
            "remark": description,
            "txlogisticId": "AAAA123123",
            "goodsType": "ITN1",
            "priceCurrency": "SAR",
            "totalQuantity": 1,
            "sender": {
                "address": "Salasa WH Suly",
                "street": "",
                "city": "Riyadh",
                "mobile": "966500000000",
                "mailBox": "salasa@gmail.com",
                "phone": "",
                "countryCode": "KSA",
                "name": "Salasa Test",
                "company": "company",
                "postCode": "",
                "prov": "Riyadh"
            },
            "itemsValue": 1000,
            "offerFee": 0,
            "items": [
                {
                    "englishName": "iphone",
                    "number": 2,
                    "itemType": "ITN1",
                    "itemName": "\u6587\u4ef6\u7c7b\u578b",
                    "priceCurrency": "SAR",
                    "itemValue": "2000",
                    "itemUrl": "http:\/\/www.baidu.com",
                    "desc": "file"
                }
            ],
            "operateType": 1,
            "payType": "PP_PM",
            "isUnpackEnabled": 0
        }
    });
    // return console.log(data)
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://demoopenapi.jtjms-sa.com/webopenplatformapi/api/order/addOrder?uuid=7a73e66f9b9c42b18d986f581e6f931e',
        headers: {
            'apiAccount': '292508153084379141',
            'digest': 'UC13OezOa1T0mRWM/YIFsQ==',
            'timestamp': '1638428570653',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };
    axios(config)
        .then(async response => {
            return console.log(response)
            if (response.data.status !== 200) {
                return res.status(400).json({
                    error: response.data
                })
            } else {
                const invo = await Daftra.CreateInvo(daftraid, req.user.user.daftraid, description, BookingMode, totalShipPrice);
                const newOrder = new anwanorders({
                    user: req.user.user.id,
                    company: "anwan",
                    ordernumber: ordersNum + 2,
                    paytype: paytype,
                    data: response.data,
                    price: totalShipPrice,
                    marktercode: markterCode,
                    createdate: new Date(),
                    inovicedaftra: invo
                })
                newOrder.save()
                    .then(async (o) => {
                        if (clintid) {
                            const clint = await Clint.findById(clintid);
                            const co = {
                                company: "anwan",
                                id: o._id
                            }
                            clint.wallet = clint.wallet - totalShipPrice;
                            clint.orders.push(co);
                            await clint.save();
                        }
                        if (!cod) {
                            user.wallet = user.wallet - totalShipPrice;

                            user.save()
                                .then(u => {
                                    res.status(200).json({
                                        data: o
                                    })
                                })
                        } else {
                            res.status(200).json({
                                data: o
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
        .catch(function (error) {
            res.status(500).json({
                msg: error
            })
            console.log(error);
        });
}
