const User = require("../model/user");

exports.checkCompany = (CompanyModel) => {
    return (
        async (req, res, next) => {
            let { cod, weight, shipmentValue } = req.body
            const { id: userId, rolle: userRolle } = req.user.user

            try {
                const user = await User.findById(userId);
                const company = await CompanyModel.findOne();

                let weightPrice = weight <= 15 ? 0 : (weight - 15) * company.kgprice;

                if (cod) {
                    if (!shipmentValue) shipmentValue = 0;

                    if (userRolle == "user") {
                        if (user.inv) {
                            var codPrice = user.inv.companies[1].cod;
                            var shipPrice = codPrice;
                        } else {
                            var shipPrice = company.codprice;
                        }
                    } else {
                        var shipPrice = cod;
                        if (cod > company.maxcodmarkteer) {
                            return res.status(400).json({ msg: "cod price is greater than your limit" })
                        }
                        if (cod < company.mincodmarkteer) {
                            return res.status(400).json({ msg: "cod price is less than your limit" })
                        }
                    }
                    res.locals.codAmount = shipPrice + weightPrice + +shipmentValue; // 10 + (25 - 15)22 + 100
                    res.locals.totalShipPrice = shipPrice + weightPrice;
                    console.log('totalShipPrice')
                    console.log(shipPrice, weightPrice, totalShipPrice)

                    next()
                } else {
                    if (userRolle == "user") {
                        if (user.inv) {
                            var onlinePrice = user.inv.companies[1].onlinePayment;
                            var shipPrice = onlinePrice;
                        } else {
                            var shipPrice = company.userprice;
                        }
                    } else {
                        var shipPrice = company.marketerprice;
                    }

                    if (user.wallet < (shipPrice + weightPrice)) {
                        return res.status(400).json({ msg: "Your wallet balance is not enough to make the shipment" })
                    }
                    res.locals.codAmount = 0;
                    res.locals.totalShipPrice = shipPrice + weightPrice;
                    console.log('totalShipPrice')
                    console.log(shipPrice, weightPrice, totalShipPrice)
                    next()
                }
            } catch (err) {
                console.log(err)
                res.status(500).json({
                    error: err.message
                })
            }
        }
    )
}

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