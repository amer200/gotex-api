const User = require("../model/user")
const Client = require("../model/clint");

const refundCanceledOrder = async (order) => {
    if (order.paytype == 'cc') {
        let user = {}
        if (order.order.for == 'user' || (order.order.for == 'client' && order.order.payedFrom == 'user-wallet')) {
            user = await User.findById(order.user)
        }

        if (order.order.for == 'client') {
            const client = await Client.findById(order.order.client)
            console.log(client)
            if (order.order.payedFrom == 'client-package') {
                ++client.package.availableOrders;
            } else if (order.order.payedFrom == 'client-wallet') {
                client.wallet += order.price
            } else if (order.order.payedFrom == 'client-credit') {
                client.credit.limet += order.price
            } else {
                user.wallet += order.price
                await user.save()
            }

            await client.save()
        } else {
            if (order.order.payedFrom == 'user-package') {
                ++user.package.availableOrders;
            } else {
                user.wallet += order.price
            }

            await user.save()
        }
    }
}

module.exports = refundCanceledOrder