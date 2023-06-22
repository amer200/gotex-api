const User = require("../model/user");
const Aramex = require("../model/aramex");
const Saee = require("../model/saee");
const Anwan = require("../model/anwan");
const Glt = require("../model/glt");
const Smsa = require("../model/smsa");
exports.check = async (req, res) => {
    const cExample = {
        name: "s",
        onlinePayment: 5,
        cod: 5
    }
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
            if (c.name == aramex.company) {
                if (c.onlinePayment < aramex.marketerprice) {
                    return res.status(400).json({
                        msg: "online price is less than your limit"
                    })
                }
                if (c.cod < aramex.marketerprice) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                myAramex.push(c)
            } else if (c.name == saee.company) {
                if (c.onlinePayment < saee.marketerprice) {
                    return res.status(400).json({
                        msg: "online price is less than your limit"
                    })
                }
                if (c.cod < saee.marketerprice) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                mySaee.push(c)
            } else if (c.name == anwan.company) {
                if (c.onlinePayment < anwan.marketerprice) {
                    return res.status(400).json({
                        msg: "online price is less than your limit"
                    })
                }
                if (c.cod < anwan.marketerprice) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                myAnwan.push(c)
            } else if (c.name == glt.company) {
                if (c.onlinePayment < glt.marketerprice) {
                    return res.status(400).json({
                        msg: "online price is less than your limit"
                    })
                }
                if (c.cod < glt.marketerprice) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                myGlt.push(c)
            } else if (c.name == glt.company) {
                if (c.onlinePayment < glt.marketerprice) {
                    return res.status(400).json({
                        msg: "online price is less than your limit"
                    })
                }
                if (c.cod < glt.marketerprice) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                myGlt.push(c)
            } else {
                return res.status(400).json({
                    msg: `${c} is not a valid company check name`
                })
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err
        })
    }
}