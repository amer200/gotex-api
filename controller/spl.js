const Spl = require("../model/spl");
const axios = require("axios");
const qs = require("qs");
const spl = require("../model/spl");
var CronJob = require('cron').CronJob;
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
    const SenderMobileNumber = req.body.SenderMobileNumber;
    const cod = req.body.cod;
    const ContentPrice = req.body.ContentPrice;
    const ContentDescription = req.body.ContentDescription;
    const Weight = req.body.Weight;
    const pickUpDistrictID = req.body.pickUpDistrictID;
    const pickUpAddress1 = req.body.pickUpAddress1;
    const pickUpAddress2 = req.body.pickUpAddress2;
    const deliveryDistrictID = req.body.deliveryDistrictID;
    const deliveryAddress1 = req.body.deliveryAddress1;
    const deliveryAddress2 = req.body.deliveryAddress2;
    const Pieces = req.body.Pieces;
    if (cod) {
        var PaymentType = 2;
        var TotalAmount = 30;
    } else {
        var PaymentType = 1;
        var TotalAmount = null;
    }
    const data = qs.stringify({
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
                'PiecesCount': Pieces.length + 1,
                "ItemPieces": Pieces
            }
        ]
    })
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/api/CreditSale/AddUPDSPickupDelivery',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `bearer ${spl.token}`
        },
        data: data
    };
    axios(config)
        .then(response => {
            if (response.data.Status != 1) {
                res.status(400).json({
                    data: response.data
                })
            } else {
                res.status(200).json({
                    reciver: {
                        name: reciverName,
                        mobile: reciverMobile,
                        city: pickUpDistrictID,
                        AddressLine1: pickUpAddress1,
                        AddressLine2: pickUpAddress2
                    },
                    sender: {
                        name: SenderName,
                        mobile: SenderMobileNumber,
                        city: deliveryDistrictID,
                        AddressLine1: deliveryAddress1,
                        AddressLine2: deliveryAddress2
                    },
                    data: response.data
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
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
exports.getCities = async(req, res) => {
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

var job = new CronJob('00 00 00 * * *', function () {
    /*
     * Runs every day
     * at 00:00:00 AM. 
     */
    const spl = Spl.findOne();
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
    /* This function is executed when the job stops */
},
    true /* Start the job right now */
);