const ccStoreOrderPay = async (params) => {
  const { clientId, client, totalAmount, user, order } = params;

  if (clientId && client) {
    if (client.wallet >= totalAmount) {
      client.wallet -= totalAmount;

      order.order.payedFrom = "client-wallet";
    } else if (
      client.credit.status == "accepted" &&
      client.credit.limet >= totalAmount
    ) {
      client.credit.limet -= totalAmount;

      order.order.payedFrom = "client-credit";
    } else {
      user.wallet -= totalAmount;
      order.order.for = "user";
      order.order.payedFrom = "user-wallet";

      await user.save();
    }
    order.order.for = "client";
    order.order.client = clientId;

    await client.save();
  } else {
    user.wallet -= totalAmount;
    order.order.for = "user";
    order.order.payedFrom = "user-wallet";
    await user.save();
  }
};

module.exports = ccStoreOrderPay;
