const Spl = require("../model/spl");
const SplOrder = require("../model/splorders");
const axios = require("axios");
const qs = require("qs");
const User = require("../model/user");
const Clint = require("../model/clint");
const splorders = require("../model/splorders");
const CronJob = require('cron').CronJob;
const { createClientInvoice } = require("../modules/daftra");

//********************************************* */
exports.edit = (req, res) => {
    const status = req.body.status;
    const userprice = req.body.userprice;
    const userCodPrice = req.body.userCodPrice;
    const marketerprice = req.body.marketerprice;
    const mincodmarkteer = req.body.mincodmarkteer;
    const maxcodmarkteer = req.body.maxcodmarkteer;
    const kgprice = req.body.kgprice;
    Spl.findOne()
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
                msg: err.message.message
            })
        })
}

exports.getToken = (req, res) => {
    const grant_type = "password";
    const UserName = "extrAccount";
    const Password = process.env.spl_password;
    var data = qs.stringify({
        'grant_type': 'password',
        'UserName': UserName,
        'Password': Password
    });
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios(config)
        .then(response => {
            console.log(response);
            Spl.findOne()
                .then(s => {
                    s.token = response.data.access_token;
                    return s.save()
                })
                .then(s => {
                    res.status(200).json({
                        msg: "token updated"
                    })
                })
        })
        .catch(err => {
            console.log(err)
        })
}
exports.creteNewOrder = async (req, res) => {
    const spl = await Spl.findOne();
    const reciverName = req.body.reciverName;
    const reciverMobile = req.body.reciverMobile;
    const SenderName = req.body.SenderName;
    const markterCode = req.body.markterCode || '';
    const SenderMobileNumber = req.body.SenderMobileNumber;
    const ContentPrice = req.body.ContentPrice;
    const ContentDescription = req.body.ContentDescription;
    const Weight = req.body.Weight;
    const pickUpDistrictID = req.body.pickUpDistrictID;
    const pickUpAddress1 = req.body.pickUpAddress1;
    const pickUpAddress2 = req.body.pickUpAddress2;
    const deliveryDistrictID = req.body.deliveryDistrictID;
    const deliveryAddress1 = req.body.deliveryAddress1;
    const deliveryAddress2 = req.body.deliveryAddress2;
    const description = req.body.description;
    if (req.body.Pieces.length <= 0) {
        var Pieces = [];
        var PiecesCount = 1;
    } else {
        var Pieces = req.body.Pieces;
        var PiecesCount = Pieces.length + 1
    }
    //********************************** */
    const totalShipPrice = res.locals.totalShipPrice;
    const clintid = req.body.clintid;
    const cod = req.body.cod;
    const user = await User.findById(req.user.user.id);
    const daftraid = req.body.daftraid;
    let ordersNum = await SplOrder.count();
    if (markterCode) {
        var nameCode = `${SenderName} (${markterCode})`;
    } else {
        var nameCode = SenderName;
    }
    //********************************* */
    if (cod) {
        var PaymentType = 2;
        var paytype = "cod";
        var TotalAmount = res.locals.codAmount;
    } else {
        var PaymentType = 1;
        var paytype = "cc";
        var TotalAmount = 10;
    }
    const data = {
        'CRMAccountId': 31314344634,
        'BranchId': 0,
        'PickupType': 0,
        'RequestTypeId': 1,
        'CustomerName': reciverName,
        'CustomerMobileNumber': reciverMobile,
        'SenderName': SenderName,
        'SenderMobileNumber': SenderMobileNumber,
        'Items': [
            {
                'ReferenceId': `${Date.now()} + Gotex`,
                'PaymentType': PaymentType,
                'ContentPrice': ContentPrice,
                'ContentDescription': ContentDescription,
                'Weight': Weight,
                'TotalAmount': TotalAmount,
                'SenderAddressDetail': {
                    'AddressTypeID': 6,
                    'LocationId': 21,
                    'DistrictID': pickUpDistrictID,
                    'AddressLine1': pickUpAddress1,
                    "AddressLine2": pickUpAddress2
                },
                'ReceiverAddressDetail': {
                    'AddressTypeID': 6,
                    'LocationId': 21,
                    'DistrictID': deliveryDistrictID,
                    'AddressLine1': deliveryAddress1,
                    "AddressLine2": deliveryAddress2
                },
                'PiecesCount': PiecesCount,
                "ItemPieces": Pieces
            }
        ]
    }
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/api/CreditSale/AddUPDSPickupDelivery',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `bearer ${spl.token}`
        },
        data: data
    };
    return res.status(200).json({
        config: config,
        body: data
    })
    const response = await axios(config)
    try {
        var config = {
            method: 'post',
            url: 'https://gateway-minasapre.sp.com.sa/api/CreditSale/AddUPDSPickupDelivery',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `bearer ${spl.token}`
            },
            data: data
        };
        const response = await axios(config)
        // console.log(response.data)
        const order = await SplOrder.create({
            user: user._id,
            company: "Spl",
            ordernumber: `${ordersNum + "/" + Date.now() + "gotex"}`,
            data: response.data,
            reciver: {
                name: reciverName,
                mobile: reciverMobile,
                city: deliveryDistrictID,
                AddressLine1: deliveryAddress1,
                AddressLine2: deliveryAddress2
            },
            sender: {
                name: SenderName,
                mobile: SenderMobileNumber,
                city: pickUpDistrictID,
                AddressLine1: pickUpAddress1,
                AddressLine2: pickUpAddress2
            },
            paytype: paytype,
            price: totalShipPrice,
            marktercode: markterCode,
            created_at: new Date(),
            weight: Weight,
            desc: ContentDescription
        })

        if (response.data.Status != 1) {
            order.status = 'failed'
            await order.save()

            res.status(400).json({
                data: response.data
            })
        } else {
            let invo = ""
            if (daftraid) {
                invo = await createClientInvoice(daftraid, req.user.user.daftraid, description, paytype, totalShipPrice, PiecesCount);
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
                    company: "spl",
                    id: order._id
                }
                clint.wallet = clint.wallet - totalShipPrice;
                clint.orders.push(co);
                await clint.save();

                order.marktercode = clint.marktercode ? clint.marktercode : null;
            }

            if (!cod) {
                let available = false
                if (user.package.userAvailableOrders) {
                    available = user.package.companies.some(company => company == "spl")
                }

                if (available) {
                    --user.package.userAvailableOrders;
                } else {
                    user.wallet = user.wallet - totalShipPrice;
                }
                await user.save()
            }

            await order.save();
            res.status(200).json({
                // reciver: {
                //     name: reciverName,
                //     mobile: reciverMobile,
                //     city: pickUpDistrictID,
                //     AddressLine1: pickUpAddress1,
                //     AddressLine2: pickUpAddress2
                // },
                // sender: {
                //     name: SenderName,
                //     mobile: SenderMobileNumber,
                //     city: deliveryDistrictID,
                //     AddressLine1: deliveryAddress1,
                //     AddressLine2: deliveryAddress2
                // },
                data: order
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err.response.data
        })
    }
}
exports.getUserOrders = async (req, res) => {
    const userId = req.user.user.id;
    splorders.find({ user: userId, status: { $ne: "failed" } }).sort({ created_at: -1 })
        .then(o => {
            res.status(200).json({
                data: o
            })
        })
        .catch(err => {
            console.log(err.request)
        })
}
exports.getCountries = async (req, res) => {
    const spl = await Spl.findOne();
    var data = qs.stringify({
        'CountryID': null
    })
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/api/Location/GetCountries',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `bearer ${spl.token}`
        },
        data: data
    }
    axios(config)
        .then(response => {
            console.log(response)
            res.status(200).json({
                data: response.data
            })
        })
        .catch(err => {
            console.log(err)
        })
}
exports.getCities = async (req, res) => {
    const spl = await Spl.findOne();
    var data = qs.stringify({
        'language': "A"
    })
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/api/GIS/GetCitiesByRegion',
        headers: {
            'Authorization': `bearer ${spl.token}`
        },
        data: data
    }
    axios(config)
        .then(response => {
            res.status(200).json({
                data: response.data
            })
        })
        .catch(err => {
            console.log(err)
        })
}
exports.getDistrict = async (req, res) => {
    const spl = await Spl.findOne();
    var data = qs.stringify({
        'language': "A",
        "RegionId": null
    })
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/api/GIS/GetDistricts',
        headers: {
            'Authorization': `bearer ${spl.token}`
        },
        data: data
    }
    axios(config)
        .then(response => {
            res.status(200).json({
                data: response.data
            })
        })
        .catch(err => {
            console.log(err)
        })
}
/********************************** */

var job = new CronJob('00 00 00 * * *', async () => {
    /*
     * Runs every day
     * at 00:00:00 AM. 
     */
    const spl = await Spl.findOne();
    const grant_type = "password";
    const UserName = "extrAccount";
    const Password = process.env.spl_password;
    var data = qs.stringify({
        'grant_type': 'password',
        'UserName': UserName,
        'Password': Password
    });
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios(config)
        .then(response => {
            // console.log(response.data.access_token);
            spl.token = response.data.access_token;
            return spl.save()
        })
        .catch(err => {
            console.log(err)
        })
}, function () {
    console.log("spl token updated")
},
    true /* Start the job right now */
);