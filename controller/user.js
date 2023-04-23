const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const salt = 10;
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
                        roll: "user"
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