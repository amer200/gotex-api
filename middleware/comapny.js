const Aramex = require("../model/aramex");
const Glt = require("../model/glt");
const Saee = require("../model/saee");
const Smsa = require("../model/smsa");
const User = require("../model/user");

exports.gltCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod;
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        const glt = await Glt.findOne();
        const user = await User.findById(userId);
        if (userRolle == "user") {
            var shipPrice = glt.userprice;
        } else {
            var shipPrice = glt.marketerprice;
        }
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * glt.kgprice;
        }
        const totalPrice = shipPrice + weightPrice;

        /**************************************** */
        if (cod) {
            // res.locals.codAmount = totalPrice
            // res.locals.totalPrice = totalPrice
            // return next()
            return res.status(400).json({
                msg: " cod is stoped !!"
            })
        }
        /*********************** */
        if (user.wallet < totalPrice) {
            return res.status(400).json({
                msg: "Your wallet balance is not enough to make the shipment"
            })
        }
        res.locals.totalPrice = totalPrice
        res.locals.codAmount = 0
        next()
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.saeeCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod;
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        const saee = await Saee.findOne();
        const user = await User.findById(userId);
        if (userRolle == "user") {
            var shipPrice = saee.userprice;
        } else {
            var shipPrice = saee.marketerprice;
        }
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * saee.kgprice;
        }
        const totalPrice = shipPrice + weightPrice;

        /**************************************** */
        if (cod) {
            // res.locals.codAmount = totalPrice
            // res.locals.totalPrice = totalPrice
            // return next()
            return res.status(400).json({
                msg: " cod is stoped !!"
            })
        }
        /*********************** */
        if (user.wallet < totalPrice) {
            return res.status(400).json({
                msg: "Your wallet balance is not enough to make the shipment"
            })
        }
        res.locals.totalPrice = totalPrice
        res.locals.codAmount = 0
        next()
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.aramexCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod;
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        const aramex = await Aramex.findOne();
        const user = await User.findById(userId);
        if (userRolle == "user") {
            var shipPrice = aramex.userprice;
        } else {
            var shipPrice = aramex.marketerprice;
        }
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * aramex.kgprice;
        }
        const totalPrice = shipPrice + weightPrice;

        /**************************************** */
        if (cod) {
            // res.locals.codAmount = totalPrice
            // res.locals.totalPrice = totalPrice
            // return next()
            return res.status(400).json({
                msg: " cod is stoped !!"
            })
        }
        /*********************** */
        if (user.wallet < totalPrice) {
            return res.status(400).json({
                msg: "Your wallet balance is not enough to make the shipment"
            })
        }
        res.locals.totalPrice = totalPrice
        res.locals.codAmount = 0
        next()
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.smsaCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod;
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        const smsa = await Smsa.findOne();
        const user = await User.findById(userId);
        if (userRolle == "user") {
            var shipPrice = smsa.userprice;
        } else {
            var shipPrice = smsa.marketerprice;
        }

        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * smsa.kgprice;
        }
        const totalPrice = shipPrice + weightPrice;
        /**************************************** */
        if (cod) {
            // res.locals.totalPrice = totalPrice
            // res.locals.codAmount = totalPrice
            // return next()
            return res.status(400).json({
                msg: " cod is stoped !!"
            })
        }
        /*********************** */
        if (user.wallet < totalPrice) {
            return res.status(400).json({
                msg: "Your wallet balance is not enough to make the shipment"
            })
        }

        res.locals.totalPrice = totalPrice
        res.locals.codAmount = 0
        next()
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}