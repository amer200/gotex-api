const User = require("../model/user");
const jwt = require("jsonwebtoken");
const SmsaOrders = require("../model/smsaorders");
const AnwanOrders = require("../model/anwanorders");
const AramexOrders = require("../model/aramexorders");
const GltOrder = require("../model/gltorders");
const SaeeOrders = require("../model/saeeorders");
const user = require("../model/user");
const smsa = require("../model/smsa");
const aramex = require("../model/aramex");
const glt = require("../model/glt");
const anwan = require("../model/anwan");
exports.logIn = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email == process.env.ALJWADEMAIL) {
        if (password == process.env.ALJWADPASS) {
            const user = {
                id: 1,
                name: "admin",
                roll: "admin"
            }
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: { user: user },
            }, process.env.ACCESS_TOKEN);
            return res.status(200).json({
                msg: "ok",
                token: token
            })
        }
    }
    if (process.env.ADMINPASS == password) {
        const user = {
            id: 1,
            name: "admin",
            roll: "admin"
        }
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: { user: user },
        }, process.env.ACCESS_TOKEN);
        return res.status(200).json({
            msg: "ok",
            token: token
        })
    } else {
        res.status(400).json({
            msg: "wrong password or email"
        })
    }
}
exports.getAllUsers = (req, res) => {
    User.find()
        .then(u => {
            res.status(200).json({
                data: u
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: err
            })
        })
}
exports.addWalletToUser = (req, res) => {
    const deposit = req.body.deposit;
    const id = req.body.id;
    User.findById(id)
        .then(u => {
            u.wallet = u.wallet + deposit;
            return u.save()
        })
        .then(u => {
            res.status(200).json({
                msg: "ok"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: err
            })
        })
}
exports.proofCrForUser = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                msg: "email is required"
            })
        }
        user.iscrproofed = true;
        await user.save()
        return res.status(200).json({
            msg: "ok"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err
        })
    }
}
exports.unProofCrForUser = (req, res) => {
    const email = req.body.email;
    User.findOne({ email: email })
        .then(u => {
            if (!u) {
                return res.status(400).json({
                    msg: "erro email not found"
                })
            } else {
                u.iscrproofed = false;
                u.save()
                    .then(u => {
                        return res.status(200).json({
                            msg: "ok"
                        })
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: "err"
            })
        })
}
exports.getAllOrders = async (req, res) => {
    try {
        const saeeorders = await SaeeOrder.find().populate("user");
        const gltorders = await GltOrder.find().populate("user");
        const aramexorders = await AramexOrder.find().populate("user");
        const smsaorders = await SmsaOrder.find().populate("user");
        const anwanorders = await AnwanOrder.find().populate("user");
        let orders = [...saeeorders, ...gltorders, ...aramexorders, ...smsaorders, ...anwanorders];
        res.status(200).json({
            data: orders
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: err
        })
    }

}