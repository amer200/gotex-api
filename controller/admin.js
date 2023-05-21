const Saee = require("../model/saee");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

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