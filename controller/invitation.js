const { exist } = require("joi");
const Invitation = require("../model/invitation");
const User = require("../model/user");
const bcrypt = require('bcrypt');
const salt = 10;

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
                            code: i.code,
                            invitation: i
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
exports.createInivtedUser = async (req, res) => {
    try {
        const { name, password, email, mobile, address, location, invCode } = req.body;
        var cr = []
        if (req.files) {
            req.files.forEach(f => {
                cr.push(f.path)
            });
        }
        // console.log(req)
        const isEmailUsed = await User.findOne({ email: email });
        if (isEmailUsed) {
            return res.status(400).json({
                msg: "this mail is already used"
            })
        }
        const inv = await Invitation.findOne({ code: invCode });
        if (!inv) {
            return res.status(400).json({
                msg: "invatation code not found"
            })
        }
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User({
            name: name,
            password: hash,
            email: email,
            mobile: mobile,
            address: address,
            location: location,
            verified: false,
            emailcode: genRandonString(4),
            rolle: "user",
            inv: inv._id,
            cr: cr
        })
        await newUser.save()
        inv.clint = newUser._id;
        await inv.save();
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
exports.getInvtationWaitingForAdmin = (req, res) => {
    Invitation.find({ clint: { $exists: true } })
        .populate("clint markter")
        .then(invs => {
            res.status(200).json({
                data: invs
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}
exports.proveInv = (req, res) => {
    const id = req.params.id;
    Invitation.findById(id)
        .then(inv => {
            inv.isapproved = true
            return inv.save()
        })
        .then(inv => {
            res.status(200).json({
                msg: "ok",
                inv: inv
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}
/********************************** */
function genRandonString(length) {
    var chars = '0123456789';
    var charLength = chars.length;
    var result = '';
    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}