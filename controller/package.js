const Package = require("../model/package");
const User = require("../model/user");

exports.addPackage = async (req, res) => {
    const { price, numberOfOrders } = req.body
    try {
        let package = await Package.findOne()

        if (package) {
            package.price = price
            package.numberOfOrders = numberOfOrders
            await package.save()
        } else {
            package = await Package.create({
                price,
                numberOfOrders
            });
        }

        res.status(200).json({ msg: 'ok', data: package })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}
exports.getPackage = async (req, res) => {
    try {
        const package = await Package.findOne()
        res.status(200).json({ data: package })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}

exports.userBuyPackage = async (req, res) => {
    const userId = req.user.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ msg: `No user for this id ${id}` })
        }
        const package = await Package.findOne()
        if (!package) {
            return res.status(404).json({ msg: `No package found` })
        }

        if (user.wallet < package.price) {
            return res.status(400).json({ msg: "Your wallet balance is not enough to buy package" })
        }
        user.wallet = user.wallet - package.price
        if (!user.packageOrders) user.packageOrders = 0;
        user.packageOrders += package.numberOfOrders
        await user.save()

        res.status(200).json({ msg: 'ok' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}