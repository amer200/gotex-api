const ccOrderPay = async (params) => {
    const { clintid, clint, totalShipPrice, user, companyName } = params

    if (clintid) {
        if (clint.package.availableOrders) {
            const availableCompany = clint.package.companies.some(company => company == companyName) || clint.package.companies[0] == 'all'
            if (availableCompany) {
                --clint.package.availableOrders;
            }
        } else if (clint.wallet > totalShipPrice) {
            clint.wallet -= totalShipPrice;
        } else if (clint.credit.status == 'accepted' && clint.credit.limet > totalShipPrice) {
            clint.credit.limet -= totalShipPrice;
        } else {
            console.log('user.wallet')
            user.wallet -= totalShipPrice;
            await user.save()
        }

        await clint.save()
    } else {
        if (user.package.userAvailableOrders && user.rolle == 'user') {
            const availableCompany = user.package.companies.some(company => company == companyName) || user.package.companies[0] == 'all'
            if (availableCompany) {
                --user.package.userAvailableOrders;
            }
        } else {
            user.wallet -= totalShipPrice;
        }

        await user.save()
    }
}

module.exports = ccOrderPay