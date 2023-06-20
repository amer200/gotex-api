const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const salt = 10;
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const sendEmail = async (email, text, id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            // service: process.env.SERVICE,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD,
            },
        });
        ejs.renderFile(__dirname + "/emailTemp.ejs", { code: text, id: id }, async function (err, data) {
            if (err) {
                console.log(err);
            } else {
                transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: "verfiy your gotex account",
                    html: data,
                }, (error, result) => {
                    if (error) return console.error(error);
                    return console.log(result);
                });
                console.log("email sent sucessfully");
            }
        })
        // await transporter.sendMail({
        // from: process.env.USER,
        // to: email,
        // subject: "verfiy your gotex account",
        // text: text,
        // });
        // transporter.sendMail({
        //     from: process.env.EMAIL,
        //     to: email,
        //     subject: "verfiy your gotex account",
        //     text: text,
        // }, (error, result) => {
        //     if (error) return console.error(error);
        //     return console.log(result);
        // });
        // console.log("email sent sucessfully");
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
    var cr = []
    // return console.log(req.files);
    if (req.files) {
        req.files.forEach(f => {
            cr.push(f.path)
        });
    }
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
                    rolle: "user",
                    cr: cr
                })
                user.save()
                    .then(u => {
                        sendEmail(u.email, u.emailcode, u._id);
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
    var cr = []
    if (req.files[0]) {
        req.files.forEach(f => {
            cr.push(f.path)
        });
    }
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
                    rolle: "marketer",
                    cr: cr
                })
                user.save()
                    .then(u => {
                        sendEmail(u.email, u.emailcode, u._id);
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
exports.activateUser = (req, res) => {
    const code = req.params.code;
    const id = req.params.id;
    User.findById(id)
        .then(u => {
            if (!u) {
                return res.status(400).json({
                    msg: "not found"
                })
            }
            if (u.emailcode == code) {
                u.verified = true;
                u.save()
                    .then(u => {
                        return res.status(200).redirect("https://gotex.vercel.app/")
                    })
            } else {
                return res.status(400).json({
                    msg: "not found"
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
                        rolle: u.rolle
                    }
                    console.log(user)
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
exports.reSendActivateCode = (req, res) => {
    const userId = req.user.user.id;
    User.findById(userId)
        .then(u => {
            u.emailcode = genRandonString(4);
            return u.save()
        })
        .then(u => {
            sendEmail(u.email, u.emailcode, u._id);
            res.status(200).json({
                msg: "email send"
            })
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