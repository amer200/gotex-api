const User = require("../model/user");
const jwt = require("jsonwebtoken");
const user = require("../model/user");
const Client = require("../model/clint");

exports.logIn = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email == process.env.ALJWADEMAIL) {
        if (password == process.env.ALJWADPASS) {
            const user = {
                id: 1,
                name: "admin",
                rolle: "admin"
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
            rolle: "admin"
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
            if (!u) {
                return res.status(400).json({
                    err: "user not found"
                })
            }
            u.wallet = u.wallet + deposit;
            return u.save()
                .then(u => {
                    res.status(200).json({
                        msg: "ok"
                    })
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
exports.changeClientCreditStatus = async (req, res) => {
    const clientId = req.body.clientid;
    const status = req.body.status;
    const client = await Client.findById(clientId);
    try {
        client.credit.status = status;
        await client.save();
        res.status(200).json({
            msg: "ok",
            data: client.credit
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            err: error
        })
    }
}