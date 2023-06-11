const User = require("../model/user");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
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
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(400).json({
            msg: "token is requires"
        })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        console.log(user)
        if (err) {
            return res.status(400).json({
                msg: err
            })
        }
        if (user.data.user.rolle == 'user') {
            req.user = user.data
            next();
        } else if (user.data.user.rolle == 'marketer') {
            req.user = user.data
            next();
        } else {
            res.status(304).json({
                msg: "not allowed"
            })
        }
    })
}
exports.isVerfied = (req, res, next) => {
    const userId = req.user.user.id;
    User.findById(userId)
        .then(u => {
            console.log(u);
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