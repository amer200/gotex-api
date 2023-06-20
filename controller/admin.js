const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/user");

exports.logIn = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
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
        res.status(200).json({
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
        if(!user){
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