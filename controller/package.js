const Client = require("../model/clint");
const Package = require("../model/package");
const User = require("../model/user");

/** in case of several types of package */
exports.addPackage = async (req, res) => {
    const { price, numberOfOrders } = req.body
    const companies = req.body.companies || ['all']
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


/** client package [by marketer] */
exports.marketerBuyClientPackage = async (req, res) => {
    const userId = req.user.user.id
    const packageId = req.params.packageId
    const clientId = req.body.clientId
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ msg: `No user for this id ${userId}` })
        }
        const package = await Package.findById(packageId)
        if (!package) {
            return res.status(404).json({ msg: `No package for this id ${packageId}` })
        }
        const client = await Client.findById(clientId)
        if (!client) {
            return res.status(404).json({ msg: `No client for this id ${clientId}` })
        }

        if (client.package.availableOrders) {
            return res.status(400).json({ msg: 'Client can\'t buy another package until completely use the previous one or cancel it.' })
        }

        if (client.wallet > package.price) {
            client.wallet -= package.price
            client.package.paidBy = 'client'
        } else {
            if (user.wallet > package.price) {
                user.wallet -= package.price
                client.package.paidBy = 'marketer'
                await user.save()
            } else {
                return res.status(400).json({ msg: "Your wallet balance is not enough to buy package" })
            }
        }

        client.package.price = package.price
        client.package.numberOfOrders = package.numberOfOrders
        client.package.companies = package.companies
        client.package.availableOrders = package.numberOfOrders
        await client.save()

        res.status(200).json({ msg: 'ok' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}
exports.marketerCancelClientPackage = async (req, res) => {
    const userId = req.user.user.id
    const clientId = req.params.clientId
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ msg: `No user for this id ${userId}` })
        }
        const client = await Client.findById(clientId)
        if (!client) {
            return res.status(404).json({ msg: `No client for this id ${clientId}` })
        }

        if (client.package.availableOrders != client.package.numberOfOrders) {
            return res.status(400).json({ msg: 'Sorry, You can\'t cancel the package after using it.' })
        } else {
            if (client.package.paidBy == 'client') {
                client.wallet += client.package.price
            } else if (client.package.paidBy == 'marketer') {
                user.wallet += client.package.price
                await user.save()
            }
            client.package = []
            await client.save()
        }

        res.status(200).json({ msg: 'You canceled package successfully and refund money.' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}
exports.marketerGetClientPackage = async (req, res) => {
    const clientId = req.params.clientId
    console.log("clientId")
    console.log(clientId)
    try {
        const client = await Client.findById(clientId)
        if (!client) {
            return res.status(404).json({ msg: `No client for this id ${clientId}` })
        }

        res.status(200).json({ data: client.package })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
}