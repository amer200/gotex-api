const Spl = require("../model/spl");
const axios = require("axios");
const qs = require("qs");
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
    console.log(spl.token)
    if (!spl.token) {
        var t_data = qs.stringify({
            'grant_type': 'password',
            'UserName': "extrAccount",
            'Password': process.env.spl_password
        });
        var t_config = {
            method: 'post',
            url: 'https://gateway-minasapre.sp.com.sa/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: t_data
        };

        const t_res = await axios(t_config);
        const j_t_res = await t_res.json();
        console.log(j_t_res);
    }
    /////////////////////////////////////////////////
    /* const data = qs.stringify({
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
     if (!spl.token) {
         var t_data = qs.stringify({
             'grant_type': 'password',
             'UserName': "extrAccount",
             'Password': process.env.spl_password
         });
         var t_config = {
             method: 'post',
             url: 'https://gateway-minasapre.sp.com.sa/token',
             headers: {
                 'Content-Type': 'application/x-www-form-urlencoded'
             },
             data: t_data
         };
 
         axios(t_config)
             .then(response => {
                 console.log(response.data.token);
                 spl.token = response.data.token
                 return spl.save()
             })
             .then(s => {
                 return s.token;
             })
             .catch(err => {
                 console.log(err)
             })
     }
     var config = {
         method: 'post',
         url: 'https://gateway-minasapre.sp.com.sa/api/CreditSale/AddUPDSPickupDelivery',
         headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             'Authorization': spl.token
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
             console.log(err.data)
         })
         */
}
exports.getCountries = (req, res) => {
    var data = qs.stringify({
        'CountryID': req.body.id
    })
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/api/Location/GetCountries',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': process.env.spl_token
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
exports.getCities = (req, res) => {
    var data = qs.stringify({
        'language': "A"
    })
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/api/GIS/GetCitiesByRegion',
        headers: {
            'Authorization': process.env.spl_token
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
exports.getDistrict = (req, res) => {
    var data = qs.stringify({
        'language': "A",
        "RegionId": req.body.rId
    })
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/api/GIS/GetDistricts',
        headers: {
            'Authorization': process.env.spl_token
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
const getSplToken = async () => {
    const grant_type = "password";
    const UserName = "extrAccount";
    const Password = process.env.spl_password;
    const spl = await Spl.findOne();

}