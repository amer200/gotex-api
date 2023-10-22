const Markter = require("../model/marketer");
const bcrypt = require('bcrypt');
const salt = 10;
const jwt = require("jsonwebtoken");

exports.MarkterSignUp = async (req, res) => {
    try {
        let { name,
            password,
            email,
            mobile,
            code } = req.body;

        const isEmailUsed = await Markter.findOne({ "email": email });
        if (isEmailUsed) {
            return res.status(400).json({
                msg: "this email is used before"
            })
        }
        const isCodeUsed = await Markter.findOne({ "code": code });
        if (isCodeUsed) {
            return res.status(400).json({
                msg: "this code is used before"
            })
        }
        const hash = bcrypt.hashSync(password, salt);
        const marketer = new Markter({
            name: name,
            password: hash,
            email: email,
            mobile: mobile,
            code: code
        })
        await marketer.save();
        res.status(200).json({
            msg: "ok"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error
        })
    }
}
exports.logIn = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const u = await Markter.findOne({ "email": email });
    try {
        if (!u) {
            return res.status(400).json({
                msg: "wrong email"
            })
        }
        if (bcrypt.compareSync(password, u.password)) {
            const user = {
                id: u._id,
                name: u.name,
                code: u.code,
                rolle: "m"
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
            return res.status(400).json({
                msg: "wrong password"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error
        })
    }
}
exports.getAllMarkters = (req, res) => {
    Markter.find()
        .then(m => {
            res.status(200).json({
                data: m
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}