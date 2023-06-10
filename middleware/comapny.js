const aramex = require("../model/aramex");
const Aramex = require("../model/aramex");
const Glt = require("../model/glt");
const Saee = require("../model/saee");
const Smsa = require("../model/smsa");
const User = require("../model/user");

exports.gltCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod;
        if (!cod) {
            return next()
        }
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
        if (user.wallet < totalPrice) {
            return res.status(200).json({
                msg: "Your wallet balance is not enough to make the shipment"
            })
        }
        user.wallet = user.wallet - totalPrice;
        await user.save()
        res.locals.codAmount = totalPrice
        next()
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.aramexCheck = async (req, res, next) => {
    next()
    // try {
    //     const cod = req.body.cod;
    //     if (!cod) {
    //         return next()
    //     }
    //     const userId = req.user.user.id;
    //     const userRolle = req.user.user.rolle;
    //     const weight = req.body.weight;
    //     const aramex = await Aramex.findOne();
    //     const user = await User.findById(userId);
    //     if (userRolle == "user") {
    //         var shipPrice = aramex.userprice;
    //     } else {
    //         var shipPrice = aramex.marketerprice;
    //     }
    //     if (weight <= 15) {
    //         var weightPrice = 0;
    //     } else {
    //         var weightPrice = (weight - 15) * aramex.kgprice;
    //     }
    //     const totalPrice = shipPrice + weightPrice;
    //     if (user.wallet < totalPrice) {
    //         return res.status(200).json({
    //             msg: "Your wallet balance is not enough to make the shipment"
    //         })
    //     }
    //     user.wallet = user.wallet - totalPrice;
    //     await user.save()
    //     res.locals.codAmount = totalPrice
    //     next()
    // } catch (err) {
    //     console.log(err)
    //     res.status(500).json({
    //         error: err
    //     })
    // }
}