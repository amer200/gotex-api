const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const salt = 10;
const sendEmail = require("../../modules/sendEmail");
const genRandomString = require("../../modules/genRandomString");
const mailSubject = "Verify your gotex account"

exports.signUp = (req, res) => {
    const { name, password, email, mobile, address, location } = req.body;
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