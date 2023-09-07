const User = require("../model/user");
const Imile = require("../model/imile");
const ImileOrder = require("../model/imileorders");
const ImileClient = require("../model/imileclients");
const axios = require("axios");
const cron = require('node-cron');
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
    try {
        const imile = await Imile.findOne();
        let { companyName, contacts, city, address, phone, email,
            backupPhone, attentions } = req.body;
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
            email: email,
            backupPhone: backupPhone,
            attentions: attentions
        })
        const c = await newC.save();
        res.status(200).json({
            data: c
        })
    } catch (err) {
        console.log(err)
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
                error: err
            })
        })
}
exports.createOrder = async (req, res) => {
    let ordersNum = await ImileOrder.count();
    const imile = await Imile.findOne();
    const user = await User.findById(req.user.user.id);
    const totalShipPrice = res.locals.totalShipPrice;
    //*************************** */
    const p_company = req.body.p_company;
    //***************************************** */
    const token = Imile.token;
    const c_company = req.body.c_company;
    const c_name = req.body.c_name;
    const c_mobile = req.body.c_mobile;
    const c_city = req.body.c_city;
    const c_area = req.body.c_area;
    const c_street = req.body.c_street;
    const c_address = req.body.c_address;
    // const c_zipcode = req.bode.c_zipcode;
    //**************************************** */
    const markterCode = req.body.markterCode;
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
    } else {
        var codAmount = 0;
        var PaymentType = "P";
        var paymentMethod = 200;
    }
    // if (markterCode) {
    //     var nameCode = `${p_name} (${markterCode})`;
    // } else {
    //     var nameCode = p_name;
    // }
    /*************************************** */
    const daftraid = req.body.daftraid;
    const shipmentDate = Date.now();
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
            "consignor": "DubaiWareHouse",
            "consignee": c_company,
            "consigneeContact": c_name,
            "consigneePhone": c_mobile,
            "consigneeCountry": "UAE",
            "consigneeProvince": "",
            "consigneeCity": "Dubai", // c_city
            "consigneeArea": "Deira", //c_area
            "consigneeSuburb": "",
            "consigneeZipCode": "80184",
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
            "pickDate": "2023-01-29",
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
    var config = {
        method: 'post',
        url: 'https://openapi.52imile.cn/client/order/createOrder',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    console.log(data)
    axios(config)
        .then(async (response) => {
            return console.log(response.data)
            if (response.data.HasErrors) {
                res.status(400).json({
                    data: response.data
                })
            } else {
                if (cod) {
                    const invo = await Daftra.CreateInvo(daftraid, req.user.user.daftraid, desc, PaymentType, totalShipPrice);
                    const newO = new AramexOrder({
                        user: req.user.user.id,
                        company: "aramex",
                        ordernumber: ordersNum + 2,
                        data: response.data,
                        paytype: "cod",
                        price: totalShipPrice,
                        marktercode: markterCode,
                        createdate: new Date(),
                        inovicedaftra: invo
                    })
                    newO.save()
                        .then(async o => {
                            if (clintid) {
                                const clint = await Clint.findById(clintid);
                                const co = {
                                    company: "aramex",
                                    id: o._id
                                }
                                clint.wallet = clint.wallet - totalShipPrice;
                                clint.orders.push(co);
                                await clint.save();
                            }
                            res.status(200).json({
                                data: o
                            })
                        })
                } else {
                    user.wallet = user.wallet - totalShipPrice;
                    const invo = await Daftra.CreateInvo(daftraid, req.user.user.daftraid, desc, PaymentType, totalShipPrice);
                    user.save()
                        .then(u => {
                            const newO = new AramexOrder({
                                user: req.user.user.id,
                                company: "aramex",
                                ordernumber: ordersNum + 2,
                                data: response.data,
                                paytype: "cc",
                                price: totalShipPrice,
                                marktercode: markterCode,
                                createdate: new Date(),
                                inovicedaftra: invo
                            })
                            newO.save()
                                .then(async o => {
                                    if (clintid) {
                                        const clint = await Clint.findById(clintid);
                                        const co = {
                                            company: "aramex",
                                            id: o._id
                                        }
                                        clint.wallet = clint.wallet - totalShipPrice;
                                        clint.orders.push(co);
                                        await clint.save();
                                    }
                                    res.status(200).json({
                                        data: o
                                    })
                                })
                        })
                }
            }
        })
        .catch(function (error) {
            console.log(error)
            res.status(500).json({
                error: error
            })
        });
}
/************************************** */
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
    } catch (err) {
        console.log(err)
    }
});