const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const salt = 10;
const sendEmail = require("../../modules/sendEmail");
const genRandomString = require("../../modules/genRandomString");
const mailSubject = "Verify your gotex account"

exports.signUp = (req, res) => {
    const { name, password, email, mobile, address, location } = req.body;
    console.log(req.body)
    var cr = []
    if (req.files) {
        req.files.forEach(f => {
            cr.push(f.path)
        });
    }
    const hash = bcrypt.hashSync(password, salt);
    User.findOne({ email: email })
        .then(u => {
            if (u) {
                res.status(409).json({
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
                    emailcode: genRandomString(6),
                    rolle: "user",
                    cr: cr
                })
                user.save()
                    .then(u => {
                        sendEmail(u.email, u.emailcode, u._id, "/../views/emailTempForMobile.ejs", mailSubject);
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
    const { userId, code } = req.body

    User.findById(userId)
        .then(u => {
            if (!u) {
                return res.status(400).json({
                    msg: "User not found"
                })
            }
            if (u.emailcode == code) {
                u.verified = true;
                u.save()
                    .then(u => {
                        return res.status(200).json({ msg: "Activated successfully" })
                    })
            } else {
                return res.status(404).json({
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
exports.reSendActivateCode = (req, res) => {
    const userId = req.user.user.id;
    User.findById(userId)
        .then(u => {
            u.emailcode = genRandomString(6);
            return u.save()
        })
        .then(u => {
            sendEmail(u.email, u.emailcode, u._id, "/../views/emailTempForMobile.ejs", mailSubject);
            res.status(200).json({
                msg: "email sent successfully"
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

exports.forgetPasswordEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                msg: "user email not found"
            })
        }

        const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN,
            {
                expiresIn: "10m"
            });

        user.emailcode = genRandomString(6);
        await user.save();
        sendEmail(user.email, user.emailcode, user._id, "/../views/password_mail_mobile.ejs", mailSubject);
        return res.status(200).json({
            msg: "email sent successfully",
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.verifyForgetPasswordCode = async (req, res) => {
    const { code } = req.body
    const user = req.user

    try {
        console.log(user.emailcode, code)
        if (user.emailcode != code) {
            return res.status(404).json({
                msg: "wrong code"
            })
        }
        user.emailcode = genRandomString(6)
        await user.save();

        return res.status(200).json({
            msg: "ok"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.setNewPassword = async (req, res) => {
    const { password } = req.body
    const user = req.user

    try {
        const hash = bcrypt.hashSync(password, salt);
        user.password = hash;
        await user.save()

        res.status(200).json({
            msg: "Password changed successfully"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}