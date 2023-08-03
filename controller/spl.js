const Spl = require("../model/spl");
const axios = require("axios");
const qs = require("qs");
exports.getToken = (req, res) => {
    const grant_type = "password";
    const UserName = "ExtrCarriyo";
    const Password = process.env.spl_password;
    var data = qs.stringify({
        'grant_type': 'password',
        'UserName': 'ExtrCarriyo',
        'Password': process.env.spl_password
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
    const reciverName = req.body.reciverName;
    const reciverMobile = req.body.reciverMobile;
    const SenderName = req.body.SenderName;
    const SenderMobileNumber = req.body.SenderMobileNumber;
    const cod = req.body.cod;
    const ContentPrice = req.body.ContentPrice;
    const ContentDescription = req.body.ContentDescription;
    const Weight = req.body.Weight;
    const pickUpCityId = req.body.pickUpCityId;
    const pickUpDistrictID = req.body.pickUpDistrictID;
    const pickUpShortAddress = req.body.pickUpShortAddress;
    const deliveryCityId = req.body.deliveryCityId;
    const deliveryDistrictID = req.body.deliveryDistrictID;
    const deliveryShortAddress = req.body.deliveryShortAddress;
    const PiecesCount = req.body.PiecesCount;
    if (cod) {
        var PaymentType = 2;
        var TotalAmount = 25;
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
                'ReferenceId': "ddsjnjhdasdas",
                'PaymentType': PaymentType,
                'ContentPrice': ContentPrice,
                'ContentDescription': ContentDescription,
                'Weight': Weight,
                'TotalAmount': TotalAmount,
                'SenderAddressDetail': {
                    'AddressTypeID': 10,
                    'LocationId': pickUpCityId,
                    'DistrictID': pickUpDistrictID,
                    'ShortAddress': pickUpShortAddress
                },
                'ReceiverAddressDetail': {
                    'AddressTypeID': 10,
                    'LocationId': deliveryCityId,
                    'DistrictID': deliveryDistrictID,
                    'ShortAddress': deliveryShortAddress
                },
                'PiecesCount': PiecesCount
            }
        ]
    })
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/api/CreditSale/AddUPDSPickupDelivery',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': process.env.spl_token
        },
        data: data
    };
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
exports.getCountries = (req, res) => {
    var config = {
        method: 'get',
        url: 'https://gateway-minasapre.sp.com.sa/api/Location/GetCountries',
        headers: {
            'Authorization': process.env.spl_token
        }
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
exports.getCities = (req, res) => {
    var config = {
        method: 'get',
        url: 'https://gateway-minasapre.sp.com.sa/api/GIS/GetCitiesByRegion',
        headers: {
            'Authorization': process.env.spl_token
        }
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
exports.getDistrict = (req, res) => {
    var config = {
        method: 'get',
        url: 'https://gateway-minasapre.sp.com.sa/api/GIS/GetDistricts',
        headers: {
            'Authorization': process.env.spl_token
        }
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