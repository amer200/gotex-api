const ccOrderPay = async (params) => {
    const { clintid, clint, totalShipPrice, user, companyName } = params

    if (clintid && clint.wallet > totalShipPrice) {
        let available = false
        if (clint.package.availableOrders) {
            available = clint.package.companies.some(company => company == companyName) || clint.package.companies[0] == 'all'
        }

        if (available) {
            --clint.package.availableOrders;
        } else {
            clint.wallet = clint.wallet - totalShipPrice;
        }
        await clint.save()
    } else {
        let available = false
        if (user.package.userAvailableOrders) {
            available = user.package.companies.some(company => company == companyName) || user.package.companies[0] == 'all'
        }

        if (available) {
            --user.package.userAvailableOrders;
        } else {
            user.wallet = user.wallet - totalShipPrice;
        }
        await user.save()
    }
}

module.exports = ccOrderPay