const User = require("../model/user");
const Aramex = require("../model/aramex");
const Saee = require("../model/saee");
const Anwan = require("../model/anwan");
const Glt = require("../model/glt");
const Smsa = require("../model/smsa");
exports.check = async (req, res, next) => {
    try {
        const companies = req.body.companies;
        const clintemail = req.body.clintemail;
        const aramex = await Aramex.findOne();
        const saee = await Saee.findOne();
        const anwan = await Anwan.findOne();
        const glt = await Glt.findOne();
        const smsa = await Smsa.findOne();
        /**************************************** */
        let myAramex = [];
        let mySaee = [];
        let myAnwan = [];
        let myGlt = [];
        let mySmsa = [];
        let errMsg;
        var valueArr = companies.map(function (item) { return item.name });
        var isDuplicate = valueArr.some(function (item, idx) {
            return valueArr.indexOf(item) != idx
        });
        if (isDuplicate) {
            return res.status(400).json({
                msg: "companies name is duplicated"
            })
        }
        /*************************************** */
        if (req.user.user.rolle !== "marketer") {
            return res.status(400).json({
                msg: "not allowed for this account rolle"
            })
        }
        if (!clintemail) {
            return res.status(400).json({
                msg: "clintemail not found"
            })
        }
        if (!Array.isArray(companies)) {
            return res.status(400).json({
                msg: "companies must be array"
            })
        }
        if (companies.length !== 5) {
            return res.status(400).json({
                msg: "must add all companies"
            })
        }
        companies.forEach(c => {
            if (c.name == aramex.name) {
                if (c.onlinePayment < aramex.marketerprice) {
                    return errMsg = `online price is less than your limit for ${c.name}`
                }
                if (c.cod < aramex.marketerprice) {
                    return errMsg = `cod price is less than your limit for ${c.name}`
                }
                myAramex.push(c)
            } else if (c.name == saee.name) {
                if (c.onlinePayment < saee.marketerprice) {

                    return errMsg = `online price is less than your limit for ${c.name}`

                }
                if (c.cod < saee.marketerprice) {
                    return errMsg = `cod price is less than your limit for ${c.name}`
                }
                mySaee.push(c)
            } else if (c.name == anwan.name) {
                if (c.onlinePayment < anwan.marketerprice) {
                    return errMsg = `online price is less than your limit for ${c.name}`
                }
                if (c.cod < anwan.marketerprice) {
                    return errMsg = `cod price is less than your limit for ${c.name}`
                }
                myAnwan.push(c)
            } else if (c.name == glt.name) {
                if (c.onlinePayment < glt.marketerprice) {
                    return errMsg = `online price is less than your limit for ${c.name}`
                }
                if (c.cod < glt.marketerprice) {
                    return errMsg = `cod price is less than your limit for ${c.name}`
                }
                myGlt.push(c)
            } else if (c.name == smsa.name) {
                if (c.onlinePayment < smsa.marketerprice) {
                    return errMsg = `online price is less than your limit for ${c.name}`
                }
                if (c.cod < smsa.marketerprice) {
                    return errMsg = `cod price is less than your limit for ${c.name}`
                }
                mySmsa.push(c)
            } else {
                return errMsg = `${c.name} is not a valid name check name`
            }
        });
        if (errMsg) {
            res.status(400).json({
                msg: errMsg
            })
        } else {
            next();
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err
        })
    }
}