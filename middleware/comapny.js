const Aramex = require("../model/aramex");
const Glt = require("../model/glt");
const Saee = require("../model/saee");
const Smsa = require("../model/smsa");
const User = require("../model/user");
const Anwan = require("../model/anwan");
const Spl = require("../model/spl");
const Imile = require("../model/imile");
const Jt = require("../model/jt");
exports.gltCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod; // change to number
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        let shipmentValue = req.body.shipmentValue; // new number must
        /*********************************************** */
        const glt = await Glt.findOne();
        const user = await User.findById(userId);
        /*********************************************** */
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * glt.kgprice;
        }
        /*********************************************** */
        if (cod) {
            if (!shipmentValue) {
                shipmentValue = 0
            }
            if (userRolle == "user") {
                if (user.inv) {
                    var codPrice = user.inv.companies[1].cod;
                    var shipPrice = codPrice;
                } else {
                    var shipPrice = glt.codprice;
                }
            } else {
                if (cod > glt.maxcodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is grater than your limit"
                    })
                }
                if (cod < glt.mincodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                var shipPrice = cod;
            }
            const codAmount = shipPrice + weightPrice + shipmentValue; // 10 + (25 - 15)22 + 100
            res.locals.codAmount = codAmount;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        } else {
            if (userRolle == "user") {
                if (user.inv) {
                    var onlinePrice = user.inv.companies[1].onlinePayment;
                    var shipPrice = onlinePrice;
                } else {
                    var shipPrice = glt.userprice;
                }
            } else {
                var shipPrice = glt.marketerprice;
            }
            if (user.wallet < (shipPrice + weightPrice)) {
                return res.status(400).json({
                    msg: "Your wallet balance is not enough to make the shipment"
                })
            }
            res.locals.codAmount = 0;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.saeeCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod; // change to number
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        let shipmentValue = req.body.shipmentValue; // new number must
        /*********************************************** */
        const saee = await Saee.findOne();
        const user = await User.findById(userId);
        /*********************************************** */
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * saee.kgprice;
        }
        /*********************************************** */
        if (cod) {
            if (!shipmentValue) {
                shipmentValue = 0
            }
            if (userRolle == "user") {
                if (user.inv) {
                    var codPrice = user.inv.companies[0].cod;
                    var shipPrice = codPrice;
                } else {
                    var shipPrice = saee.codprice;
                }
            } else {
                if (cod > saee.maxcodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is grater than your limit"
                    })
                }
                if (cod < saee.mincodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                var shipPrice = cod;
            }
            const codAmount = shipPrice + weightPrice + shipmentValue; // 10 + (25 - 15)22 + 100
            res.locals.codAmount = codAmount;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        } else {
            if (userRolle == "user") {
                if (user.inv) {
                    var onlinePrice = user.inv.companies[0].onlinePayment;
                    var shipPrice = onlinePrice;
                } else {
                    var shipPrice = saee.userprice;
                }
            } else {
                var shipPrice = saee.marketerprice;
            }
            if (user.wallet < (shipPrice + weightPrice)) {
                return res.status(400).json({
                    msg: "Your wallet balance is not enough to make the shipment"
                })
            }
            res.locals.codAmount = 0;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.aramexCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod; // change to number
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        let shipmentValue = req.body.shipmentValue; // new number must
        /*********************************************** */
        const aramex = await Aramex.findOne();
        const user = await User.findById(userId);
        /*********************************************** */
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * aramex.kgprice;
        }
        /*********************************************** */
        if (cod) {
            if (!shipmentValue) {
                shipmentValue = 0
            }
            if (userRolle == "user") {
                if (user.inv) {
                    var codPrice = user.inv.companies[3].cod;
                    var shipPrice = codPrice;
                } else {
                    var shipPrice = aramex.codprice;
                }
            } else {
                if (cod > aramex.maxcodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is grater than your limit"
                    })
                }
                if (cod < aramex.mincodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                var shipPrice = cod;
            }
            const codAmount = shipPrice + weightPrice + shipmentValue; // 10 + (25 - 15)22 + 100
            res.locals.codAmount = codAmount;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        } else {
            if (userRolle == "user") {
                if (user.inv) {
                    var onlinePrice = user.inv.companies[3].onlinePayment;
                    var shipPrice = onlinePrice;
                } else {
                    var shipPrice = aramex.userprice;
                }
            } else {
                var shipPrice = aramex.marketerprice;
            }
            if (user.wallet < (shipPrice + weightPrice)) {
                return res.status(400).json({
                    msg: "Your wallet balance is not enough to make the shipment"
                })
            }
            res.locals.codAmount = 0;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.smsaCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod; // change to number
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        let shipmentValue = req.body.shipmentValue; // new number must
        /*********************************************** */
        const smsa = await Smsa.findOne();
        const user = await User.findById(userId);
        /*********************************************** */
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * smsa.kgprice;
        }
        /*********************************************** */
        if (cod) {
            if (!shipmentValue) {
                shipmentValue = 0
            }
            if (userRolle == "user") {
                if (user.inv) {
                    var codPrice = user.inv.companies[2].cod;
                    var shipPrice = codPrice;
                } else {
                    var shipPrice = smsa.codprice;
                }
            } else {
                if (cod > smsa.maxcodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is grater than your limit"
                    })
                }
                if (cod < smsa.mincodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                var shipPrice = cod;
            }
            const codAmount = shipPrice + weightPrice + shipmentValue; // 10 + (25 - 15)22 + 100
            res.locals.codAmount = codAmount;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        } else {
            if (userRolle == "user") {
                if (user.inv) {
                    var onlinePrice = user.inv.companies[2].onlinePayment;
                    var shipPrice = onlinePrice;
                } else {
                    var shipPrice = smsa.userprice;
                }
            } else {
                var shipPrice = smsa.marketerprice;
            }
            if (user.wallet < (shipPrice + weightPrice)) {
                return res.status(400).json({
                    msg: "Your wallet balance is not enough to make the shipment"
                })
            }
            res.locals.codAmount = 0;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.anwanCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod; // change to number
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        let shipmentValue = req.body.shipmentValue; // new number must
        /*********************************************** */
        const anwan = await Anwan.findOne();
        const user = await User.findById(userId).populate("inv");
        /*********************************************** */
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * anwan.kgprice;
        }
        /*********************************************** */
        if (cod) {
            if (!shipmentValue) {
                shipmentValue = 0
            }
            if (userRolle == "user") {
                if (user.inv) {
                    var codPrice = user.inv.companies[4].cod;
                    var shipPrice = codPrice;
                } else {
                    var shipPrice = anwan.codprice;
                }
            } else {
                if (cod > anwan.maxcodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is grater than your limit"
                    })
                }
                if (cod < anwan.mincodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                var shipPrice = cod;
            }
            const codAmount = shipPrice + weightPrice + shipmentValue; // 10 + (25 - 15)22 + 100
            res.locals.codAmount = codAmount;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        } else {
            if (userRolle == "user") {
                if (user.inv) {
                    var onlinePrice = user.inv.companies[4].onlinePayment;
                    var shipPrice = onlinePrice;
                } else {
                    var shipPrice = anwan.userprice;
                }
            } else {
                var shipPrice = anwan.marketerprice;
            }
            if (user.wallet < (shipPrice + weightPrice)) {
                return res.status(400).json({
                    msg: "Your wallet balance is not enough to make the shipment"
                })
            }
            res.locals.codAmount = 0;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.splCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod; // change to number
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.Weight;
        let shipmentValue = req.body.shipmentValue; // new number must
        /*********************************************** */
        const spl = await Spl.findOne();
        const user = await User.findById(userId);
        /*********************************************** */
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * spl.kgprice;
        }
        /*********************************************** */
        if (cod) {
            if (!shipmentValue) {
                shipmentValue = 0
            }
            if (userRolle == "user") {
                if (user.inv) {
                    var codPrice = user.inv.companies[0].cod;
                    var shipPrice = codPrice;
                } else {
                    var shipPrice = spl.codprice;
                }
            } else {
                if (cod > spl.maxcodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is grater than your limit"
                    })
                }
                if (cod < spl.mincodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                var shipPrice = cod;
            }
            const codAmount = shipPrice + weightPrice + shipmentValue; // 10 + (25 - 15)22 + 100
            console.log(shipPrice)
            console.log(weightPrice)
            console.log(shipmentValue)
            res.locals.codAmount = codAmount;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        } else {
            if (userRolle == "user") {
                if (user.inv) {
                    var onlinePrice = user.inv.companies[0].onlinePayment;
                    var shipPrice = onlinePrice;
                } else {
                    var shipPrice = spl.userprice;
                }
            } else {
                var shipPrice = spl.marketerprice;
            }
            if (user.wallet < (shipPrice + weightPrice)) {
                return res.status(400).json({
                    msg: "Your wallet balance is not enough to make the shipment"
                })
            }
            res.locals.codAmount = 0;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.imileCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod; // change to number
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        let shipmentValue = req.body.goodsValue; // new number must
        /*********************************************** */
        const imile = await Imile.findOne();
        const user = await User.findById(userId);
        /*********************************************** */
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * imile.kgprice;
        }
        /*********************************************** */
        if (cod) {
            if (!shipmentValue) {
                shipmentValue = 0
            }
            if (userRolle == "user") {
                if (user.inv) {
                    var codPrice = user.inv.companies[3].cod;
                    var shipPrice = codPrice;
                } else {
                    var shipPrice = imile.codprice;
                }
            } else {
                if (cod > imile.maxcodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is grater than your limit"
                    })
                }
                if (cod < imile.mincodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                var shipPrice = cod;
            }
            const codAmount = shipPrice + weightPrice + shipmentValue; // 10 + (25 - 15)22 + 100
            res.locals.codAmount = codAmount;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        } else {
            if (userRolle == "user") {
                if (user.inv) {
                    var onlinePrice = user.inv.companies[3].onlinePayment;
                    var shipPrice = onlinePrice;
                } else {
                    var shipPrice = imile.userprice;
                }
            } else {
                var shipPrice = imile.marketerprice;
            }
            if (user.wallet < (shipPrice + weightPrice)) {
                return res.status(400).json({
                    msg: "Your wallet balance is not enough to make the shipment"
                })
            }
            res.locals.codAmount = 0;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.jtCheck = async (req, res, next) => {
    try {
        const cod = req.body.cod; // change to number
        const userId = req.user.user.id;
        const userRolle = req.user.user.rolle;
        const weight = req.body.weight;
        let shipmentValue = req.body.goodsValue; // new number must
        /*********************************************** */
        const jt = await Jt.findOne();
        const user = await User.findById(userId);
        /*********************************************** */
        if (weight <= 15) {
            var weightPrice = 0;
        } else {
            var weightPrice = (weight - 15) * jt.kgprice;
        }
        /*********************************************** */
        if (cod) {
            if (!shipmentValue) {
                shipmentValue = 0
            }
            if (userRolle == "user") {
                if (user.inv) {
                    var codPrice = user.inv.companies[3].cod;
                    var shipPrice = codPrice;
                } else {
                    var shipPrice = jt.codprice;
                }
            } else {
                if (cod > jt.maxcodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is grater than your limit"
                    })
                }
                if (cod < jt.mincodmarkteer) {
                    return res.status(400).json({
                        msg: "cod price is less than your limit"
                    })
                }
                var shipPrice = cod;
            }
            const codAmount = shipPrice + weightPrice + shipmentValue; // 10 + (25 - 15)22 + 100
            res.locals.codAmount = codAmount;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        } else {
            if (userRolle == "user") {
                if (user.inv) {
                    var onlinePrice = user.inv.companies[3].onlinePayment;
                    var shipPrice = onlinePrice;
                } else {
                    var shipPrice = jt.userprice;
                }
            } else {
                var shipPrice = jt.marketerprice;
            }
            if (user.wallet < (shipPrice + weightPrice)) {
                return res.status(400).json({
                    msg: "Your wallet balance is not enough to make the shipment"
                })
            }
            res.locals.codAmount = 0;
            res.locals.totalShipPrice = shipPrice + weightPrice;
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
/**************************************************** */
exports.isCrProofed = (req, res, next) => {
    const userId = req.user.user.id;
    User.findById(userId)
        .then(u => {
            if (u.rolle == "marketer" || u.iscrproofed == true) {
                return next()
            }
            return res.status(400).json({
                msg: "The commercial registry must be documented to make shipments to this company"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}