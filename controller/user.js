const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const salt = 10;
const nodemailer = require("nodemailer");
const sendEmail = async (email, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: smtp.hostinger.com,
            // service: process.env.SERVICE,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: "verfiy your gotex account",
            text: text,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};
function genRandonString(length) {
    var chars = '0123456789';
    var charLength = chars.length;
    var result = '';
    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}
exports.signUp = (req, res) => {
    const { name, password, email, mobile, address, location } = req.body;
    const hash = bcrypt.hashSync(password, salt);
    User.findOne({ email: email })
        .then(u => {
            if (u) {
                res.status(200).json({
                    msg: "error this email is already used"
                })
            } else {
                const user = new User({
                    name: name,
                    password: hash,
                    email: email,
                    mobile: mobile,
                    address: address,
                    location: location,
                    verified: false,
                    emailcode: genRandonString(4),
                    rolle: "user"
                })
                user.save()
                    .then(u => {
                        res.status(200).json({
                            msg: "ok",
                            user: u
                        })
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: err.message
            })
        })
}
exports.MarkterSignUp = (req, res) => {
    const { name, password, email, mobile, address, location } = req.body;
    const hash = bcrypt.hashSync(password, salt);
    User.findOne({ email: email })
        .then(u => {
            if (u) {
                res.status(200).json({
                    msg: "error this email is already used"
                })
            } else {
                const user = new User({
                    name: name,
                    password: hash,
                    email: email,
                    mobile: mobile,
                    address: address,
                    location: location,
                    verified: false,
                    emailcode: genRandonString(4),
                    rolle: "marketer"
                })
                user.save()
                    .then(u => {
                        res.status(200).json({
                            msg: "ok",
                            user: u
                        })
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: err.message
            })
        })
}
exports.logIn = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(u => {
            if (u) {
                if (bcrypt.compareSync(password, u.password)) {
                    const user = {
                        id: u._id,
                        name: u.name,
                        rolle: "user"
                    }
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: { user: user },
                    }, process.env.ACCESS_TOKEN);
                    // const token = jwt.sign({ user: user }, process.env.ACCESS_TOKEN);
                    res.status(200).json({
                        msg: "ok",
                        token: token
                    })
                } else {
                    res.status(400).json({
                        msg: "wrong password or email"
                    })
                }
            } else {
                res.status(400).json({
                    msg: "wrong password or email"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: "server error",
                error: err.message
            })
        })
}
exports.getUserBalance = (req, res) => {
    const id = req.user.user.id;
    User.findById(id)
        .then(u => {
            res.status(200).json({
                data: u.wallet
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: err
            })
        })
}