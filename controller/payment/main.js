const axios = require('axios');
const genRandomString = require("../../modules/genRandomString");
const User = require("../../model/user");
const PaymentOrder = require("../../model/payment/orders");
const Client = require("../../model/clint");
const cclink = require("../../model/payment/cclink");
const { json } = require('body-parser');

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
            'Authorization': process.env.TAP_TOKEN,
            'Content-Type': 'application/json'
        },
        data: data
    };
    try {
        const response = await axios.request(config);
        const order = new PaymentOrder({
            user: userId,
            data: response.data,
            amount: amount,
            code: authCode,
            status: "pinding",
            created_at: new Date()
        })
        await order.save();
        res.status(200).json({
            data: response.data
        })
    } catch (error) {
        console.log(error)
    }

}

exports.userCharge = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.user.id;

    try {
        const user = await User.findById(userId)
        const code = genRandomString(10)

        let data = JSON.stringify({
            "amount": amount,
            "currency": "SAR",
            "threeDSecure": true,
            "save_card": false,
            "customer_initiated": true,
            "description": "Test Description",
            "statement_descriptor": "Sample",
            "metadata": {
                "udf1": "test 1",
                "udf2": "test 2"
            },
            "reference": {
                "transaction": "txn_0001",
                "order": "ord_0001"
            },
            "receipt": {
                "email": true,
                "sms": false
            },
            "customer": {
                "first_name": user.name,
                "last_name": "",
                "email": user.email,
                "phone": {
                    "country_code": "966",
                    "number": user.mobile
                }
            },
            "merchant": {
                "id": ""
            },
            "source": {
                "id": "src_all"
            },
            "post": {
                "url": `https://dashboard.go-tex.net/api/user/check-tap-payment/${userId}/${code}`
            },
            "redirect": {
                "url": `https://dashboard.go-tex.net/api/user/check-tap-payment/${userId}/${code}`
            }
        });
        let config = {
            method: 'POST',
            url: 'https://api.tap.company/v2/charges/',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: process.env.TAP_TOKEN
            },
            data: data
        };
        const response = await axios(config);

        const paymentOrder = await PaymentOrder.create({
            user: userId,
            data: response.data,
            amount: amount,
            code: code,
            status: "pending",
            created_at: new Date(),
        })

        res.status(200).json({ data: response.data })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: { status: err.status, message: err.message, stack: err.stack }
        })
    }
}

exports.checkPayment = async (req, res) => {
    const { userId, code } = req.params

    try {
        const order = await PaymentOrder.findOne({ code });
        const user = await User.findById(userId);


        if (!order) {
            return res.render("payment-result", {
                text1: `Failed, this payment order is not found`,
                text2: `Your wallet is = `,
                balance: user.wallet
            })
            res.status(400).json({
                data: "failed"
            })
        }

        const charge = await getCharge(order.data.id)
        const currentStatus = charge.data.status

        if (currentStatus != "CAPTURED") {
            return res.render("payment-result", {
                text1: `Your charge status is ${currentStatus}`,
                text2: `Your wallet is = `,
                balance: user.wallet
            })
            return res.status(400).json({
                data: status
            })
        } else {
            user.wallet = user.wallet + order.amount
            await user.save()

            order.code = genRandomString(10);
        }

        order.status = currentStatus;
        await order.save()
        return res.render("payment-result", {
            text1: `Your charge status is ${currentStatus}`,
            text2: `Your wallet is = `,
            balance: user.wallet
        })

        const data = {
            amount: order.amount,
            userBalance: user.wallet
        }
        res.status(200).json({
            data: data
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err.message
        })
    }
}

exports.getUserPaymentOrders = async (req, res) => {
    const userId = req.user.user.id;
    const orders = await PaymentOrder.find({ user: userId }).sort({ created_at: -1 });
    try {
        res.status(200).json({
            data: orders
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err.message
        })
    }
}

exports.genrateCclink = async (req, res) => {
    const clientId = req.params.cId;
    const userId = req.params.uId;
    const amount = req.body.amount;
    const client = await Client.findById(clientId);
    try {
        if (!client) {
            return res.status(400).json({
                msg: "client note fount !"
            })
        }
        if (!amount) {
            return res.status(400).json({
                msg: "amount is required"
            })
        }
        let newCc = new cclink({
            user: userId,
            client: clientId,
            amount: amount,
            url: "tapRes.transaction.url",
            tapid: "tapRes.id",
            status: "pending"
        })
        const tapRes = await genratePaymentRequet(amount, client.name, client.email, client.mobile, newCc._id)
        newCc.url = tapRes.transaction.url;
        newCc.tapid = tapRes.id
        await newCc.save();
        return res.status(200).json({
            data: newCc
        })
    } catch (error) {
        res.status(500).json({
            data: error
        })
        console.log(error)
    }
}
exports.checkCcPayment = async (req, res) => {
    const ccId = req.params.ccId;
    const cc = await cclink.findById(ccId);
    try {
        if (!cc) {
            return res.status(404).json({
                msg: "not fount!"
            })
        }
        const charge = await getCharge(cc.tapid);
        const currentStatus = charge.data.status
        if (currentStatus != "CAPTURED") {
            return res.send("failed");
        } else {
            const client = await Client.findById(cc.client);
            client.wallet = client.wallet + cc.amount;
            return res.render("payment-result", {
                text1: `Your charge status is ${currentStatus}`,
                text2: `Your wallet is = `,
                balance: client.wallet
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: error
        })
    }
}
//******************** */
const genratePaymentRequet = async (amount, name, email, mobile, ccId) => {

    let data = JSON.stringify({
        "amount": amount,
        "currency": "SAR",
        "threeDSecure": true,
        "save_card": false,
        "customer_initiated": true,
        "description": "gotex payment",
        "statement_descriptor": "Sample",
        "metadata": {
            "udf1": "test 1",
            "udf2": "test 2"
        },
        "reference": {
            "transaction": "txn_0001",
            "order": "ord_0001"
        },
        "receipt": {
            "email": true,
            "sms": true
        },
        "customer": {
            "first_name": name,
            "last_name": "",
            "email": email,
            "phone": {
                "country_code": "966",
                "number": mobile
            }
        },
        "merchant": {
            "id": ""
        },
        "source": {
            "id": "src_all"
        },
        "post": {
            "url": `https://dashboard.go-tex.net/api/markter/check-cc-payment/${ccId}`
        },
        "redirect": {
            "url": `https://dashboard.go-tex.net/api/markter/check-cc-payment/${ccId}`
        }
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.tap.company/v2/charges',
        headers: {
            'Authorization': process.env.TAP_TOKEN,
            'Content-Type': 'application/json'
        },
        data: data
    };
    const response = await axios(config);
    return response.data
}
const getCharge = async (chargeId) => {
    try {
        const config = {
            method: 'GET',
            url: `https://api.tap.company/v2/charges/${chargeId}`,
            headers: {
                accept: 'application/json',
                Authorization: process.env.TAP_TOKEN
            }
        };

        const response = await axios(config);
        return response
    } catch (err) {
        console.log(err)
    }
}