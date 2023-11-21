const Package = require("../model/package");
const User = require("../model/user");

/** in case of several types of package */
exports.addPackage = async (req, res) => {
    const { price, numberOfOrders, companies } = req.body
    try {
        const package = await Package.create({
            price,
            numberOfOrders,
            companies
        });

        res.status(200).json({ msg: 'ok', data: package })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}
exports.editPackage = async (req, res) => {
    const packageId = req.params.id
    const { price, numberOfOrders, companies } = req.body
    try {
        let package = await Package.findById(packageId)

        if (!package) {
            return res.status(404).json(`No package for this id ${packageId}`)
        }

        package.price = price
        package.numberOfOrders = numberOfOrders
        package.companies = companies
        await package.save()

        res.status(200).json({ msg: 'ok', data: package })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}
exports.deletePackage = async (req, res) => {
    const packageId = req.params.id
    try {
        let package = await Package.findByIdAndDelete(packageId)

        if (!package) {
            return res.status(404).json(`No package for this id ${packageId}`)
        }

        res.status(200).json({ msg: 'Package deleted successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}
exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.find({})
        res.status(200).json({ data: packages })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}

exports.userBuyPackage = async (req, res) => {
    const userId = req.user.user.id
    const packageId = req.params.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ msg: `No user for this id ${userId}` })
        }
        const package = await Package.findById(packageId)
        if (!package) {
            return res.status(404).json({ msg: `No package for this id ${packageId}` })
        }

        if (user.wallet < package.price) {
            return res.status(400).json({ msg: "Your wallet balance is not enough to buy package" })
        }
        if (user.package.userAvailableOrders) {
            return res.status(400).json({ msg: 'You can\'t buy another package until you completely use the previous one or cancel it.' })
        }

        user.package.price = package.price
        user.package.numberOfOrders = package.numberOfOrders
        user.package.companies = package.companies
        user.package.userAvailableOrders = package.numberOfOrders
        user.wallet -= package.price
        await user.save()

        res.status(200).json({ msg: 'ok' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}
/**
 * @Desc : cancel order and refund money if user didn't use it.
 * Note: All info about the package is saved to user data so in case of package update, 
 * user is treated with the previous info before the update.
 */
exports.userCancelPackage = async (req, res) => {
    const userId = req.user.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ msg: `No user for this id ${userId}` })
        }

        if (user.package.userAvailableOrders != user.package.numberOfOrders) {
            return res.status(400).json({ msg: 'Sorry, You can\'t cancel the package after using it.' })
        } else {
            user.wallet += user.package.price
            user.package = []
            await user.save()
        }

        res.status(200).json({ msg: 'You canceled package successfully and refund your money.' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}
exports.userGetPackage = async (req, res) => {
    const userId = req.user.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ msg: `No user for this id ${userId}` })
        }

        res.status(200).json({ data: user.package })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}