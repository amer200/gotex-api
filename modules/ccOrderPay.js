const ccOrderPay = async (params) => {
    const { clintid, clint, totalShipPrice, user, companyName, order } = params;

    if (clintid && clint) {

        let canUsePackage = false
        if (clint.package.availableOrders) {
            canUsePackage = clint.package.companies.some((company) => company == companyName) || clint.package.companies[0] == "all";
        }

        if (canUsePackage) {
            --clint.package.availableOrders;

            order.order.payedFrom = "client-package";
        } else if (clint.wallet >= totalShipPrice) {
            clint.wallet -= totalShipPrice;

            order.order.payedFrom = "client-wallet";
        } else if (
            clint.credit.status == "accepted" &&
            clint.credit.limet >= totalShipPrice
        ) {
            clint.credit.limet -= totalShipPrice;

            order.order.payedFrom = "client-credit";
        } else {
            user.wallet -= totalShipPrice;
            await user.save();
        }
        order.order.for = "client";
        order.order.client = clintid;

        await clint.save();
    } else {
        let canUsePackage = false
        if (user.package.availableOrders) {
            const avacanUsePackageilableCompany = user.package.companies.some((company) => company == companyName) || user.package.companies[0] == "all";
        }

        if (user.rolle == "user" && canUsePackage) {
            --user.package.userAvailableOrders;

            order.order.payedFrom = "user-package";
        } else {
            user.wallet -= totalShipPrice;
        }

        await user.save();
    }
};

module.exports = ccOrderPay;
