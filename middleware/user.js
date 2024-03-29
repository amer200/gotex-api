const User = require("../model/user");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const { addUserAsClient } = require("../controller/clients/clients");
const joiPassword = Joi.extend(joiPasswordExtendCore);
const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    mobile: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string(),
    location: Joi.string(),
    password: joiPassword.string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .min(8)
        .required(),
});

exports.isValide = (req, res, next) => {
    try {
        const { name, password, email, mobile, address, location } = req.body;
        const result = userSchema.validate({
            name: name,
            email: email,
            password: password,
            location: location,
            mobile: mobile,
            address: address
        })
        if (result.error) {
            res.status(400).json({
                msg: result.error
            })
        } else {
            next();
        }
    } catch (err) {
        res.status(500).json({
            msg: "server error",
            error: err.msg
        })
    }
}
exports.isAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(400).json({
                msg: "token is requires"
            })
        }
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                return res.status(400).json({
                    msg: err
                })
            }
            console.log(user)
            if (user.data.user.rolle == 'user') {
                req.user = user.data
                next();
            } else if (user.data.user.rolle == 'marketer') {
                req.user = user.data
                next();
            } else if (user.data.user.rolle == 'admin') {
                req.user = user.data
                next();
            } else {
                res.status(405).json({
                    msg: "not allowed"
                })
            }
        })
    } catch (err) {
        console.log(`user erro : ${err}`)
    }
}
exports.isMarkter = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(400).json({
                msg: err
            })
        }
        if (user.data.user.rolle == 'marketer') {
            req.user = user.data
            next();
        } else {
            res.status(405).json({
                msg: "not allowed"
            })
        }
    })
}
exports.isVerfied = (req, res, next) => {
    const userId = req.user.user.id;
    User.findById(userId)
        .then(u => {
            if (u.verified) {
                return next()
            }
            return res.status(400).json({
                msg: "user email not verified"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: err
            })
        })
}

/** To add user as a daftra client */
exports.isClient = async (req, res, next) => {
    const userId = req.user.user.id;
    let daftraid = req.body.daftraid;
    console.log(daftraid)
    try {
        const user = await User.findById(userId)

        if (!daftraid) {
            if (user.daftraClientId) {
                req.body.daftraid = user.daftraClientId
                next()
            } else {
                const result = await addUserAsClient(user)
                if (result.result !== 'success') {
                    return res.status(400).json({ msg: result })
                }
                req.body.daftraid = user.daftraClientId = result.data.daftraClientId
                await user.save()
                next()
            }
        } else {
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err.message
        })
    }
}