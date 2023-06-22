const invitation = require("../model/invitation");
const Invitation = require("../model/invitation");
const User = require("../model/invitation");

exports.create = (req, res) => {
    const mId = req.user.user.id;
    const companies = req.body.companies;
    const clintemail = req.body.clintemail;
    const code = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const invitation = new Invitation({
        code: code,
        clintemail: clintemail,
        markter: mId,
        companies: companies
    })
    Invitation.findOne({ code: code })
        .then(inv => {
            if (inv) {
                return res.status(400).json({
                    msg: "error with code try again (resend the request)"
                })
            } else {
                invitation.save()
                    .then(i => {
                        res.status(200).json({
                            code: i.code
                        })
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: err
            })
        })
}