const axios = require("axios");
const User = require("../model/user");
const Jt = require("../model/jt");
const JtOrder = require("../model/jtorders");
var crypto = require('crypto');
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
    // console.log(bizContent)
    let data = qs.stringify({
        bizContent: bizContent
    });
    // return console.log(bizContent)
    let myText = bizContent + "a0a1047cce70493c9d5d29704f05d0d9";
    var md5Hash = crypto.createHash('md5').update(myText).digest('base64');
    // console.log(md5Hash)
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
        await newOrder.save;
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
