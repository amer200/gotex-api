const axios = require('axios');
const genRandomString = require("../../modules/genRandomString");
const User = require("../../model/user");
const paymentOrder = require("../../model/payment/orders");
exports.addDepoist = async (req, res) => {
    const amount = req.body.amount;
    const firstName = req.body.first_name;
    const middleName = req.body.middle_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const countryCode = req.body.country_code;
    const phone = req.body.phone;
    const authCode = genRandomString(10);
    const userId = req.user.user.id;
    let data = JSON.stringify({
        "amount": amount,
        "currency": "SAR",
        "customer_initiated": true,
        "threeDSecure": true,
        "save_card": false,
        "description": "Test Description",
        "metadata": {
            "udf1": "Metadata 1"
        },
        "reference": {
            "transaction": "txn_01",
            "order": "ord_01"
        },
        "receipt": {
            "email": true,
            "sms": true
        },
        "customer": {
            "first_name": firstName,
            "middle_name": middleName,
            "last_name": lastName,
            "email": email,
            "phone": {
                "country_code": countryCode,
                "number": phone
            }
        },
        "merchant": {
            "id": "1234"
        },
        "source": {
            "id": "src_all"
        },
        "redirect": {
            "url": `http://dashboard.go-tex.net`
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.tap.company/v2/charges',
        headers: {
            'Authorization': 'Bearer sk_test_iN3MadpErZUhYeIV9WCvXOo4',
            'Content-Type': 'application/json'
        },
        data: data
    };
    try {
        const response = await axios.request(config);
        const order = new paymentOrder({
            user: userId,
            data: response.data,
            amount: amount,
            code: authCode,
            status: "pinding"
        })
        await order.save();
        res.status(200).json({
            data: response.data
        })
    } catch (error) {
        console.log(error)
    }

}