const jwt = require("jsonwebtoken");
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const { addUserAsClient } = require("../controller/clients/clients");
const joiPassword = Joi.extend(joiPasswordExtendCore);
const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    mobile: Joi.string().required(),
    email: Joi.string().email().required(),
    code: Joi.string().required(),
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
        const { name, password, email, mobile, code } = req.body;
        const result = userSchema.validate({
            name: name,
            email: email,
            password: password,
            mobile: mobile,
            code: code
        })
        if (result.error) {
            res.status(400).json({
                msg: result.error
            })
        } else {
            next();
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: "server error",
            error: err.msg
        })
    }
}