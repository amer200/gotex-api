const User = require("../model/user")
const Order = require("../model/orders")
const paginate = require("../modules/paginate")

const AnwanOrder = require("../model/anwanorders");
const AramexOrder = require("../model/aramexorders");
const SmsaOrder = require("../model/smsaorders");
const SplOrder = require("../model/splorders");
const Client = require("../model/clint");

/**
 * @Desc :  Filter with company, paytype, billCode, marktercode or keyword (user data -> name, email or mobile)
 *        + Filter by date
 *        + Pagination
 */
// TODO: Add Glt orders
// exports.getAllOrders = async (req, res) => {
//     /** Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
//     let page = +req.query.page || 1
//     const limit = +req.query.limit || 30
//     const skip = (page - 1) * limit
//     const startDate = req.query.startDate || new Date('2000-01-01')
//     const endDate = req.query.endDate || new Date()
//     const { company = '', paytype = '', marktercode = '', keyword = '' } = req.query
//     // , billCode = ''
//     try {
//         console.time('blocking await')
//         const query = {
//             paytype: { $regex: paytype, $options: 'i' },// $options: 'i' to make it case-insensitive (accept capital or small chars)
//             marktercode: { $regex: marktercode, $options: 'i' },
//             company: { $regex: company, $options: 'i' },
//             // "data.awb_no": { $regex: billCode, $options: 'i' },
//             created_at: {
//                 $gte: startDate,
//                 $lte: endDate
//             },
//             status: { $ne: "failed" },
//         }
//         const populateObj = {
//             path: 'user',
//             /**@Desc if users.name or user.email != keyword, it returns user=null */
//             match: {
//                 $or: [
//                     { name: { $regex: keyword, $options: 'i' } },
//                     { email: { $regex: keyword, $options: 'i' } },
//                     { mobile: { $regex: keyword, $options: 'i' } }
//                 ]
//             },
//             select: "name email mobile"
//         }

//         let ordersPerPage = await Order.find(query)
//             .limit(limit).skip(skip).sort({ created_at: -1 })
//             .populate(populateObj);

//         let numberOfOrders = ''
//         let allOrders = []
//         if (keyword) {
//             ordersPerPage = ordersPerPage.filter(ordersPerPage => ordersPerPage.user) // filter orders to remove user=null
//             allOrders = await Order.find(query).populate(populateObj);
//             numberOfOrders = allOrders.filter(allOrders => allOrders.user).length
//         } else {
//             numberOfOrders = await Order.find(query).countDocuments()
//         }

//         const numberOfPages = (numberOfOrders % limit == 0) ? numberOfOrders / limit : Math.floor(numberOfOrders / limit) + 1;

//         console.timeEnd('blocking await')
//         res.status(200).json({
//             result: ordersPerPage.length,
//             pagination: {
//                 currentPage: page,
//                 limit,
//                 numberOfPages
//             },
//             data: ordersPerPage
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             error: err.message
//         })
//     }
// }

// exports.getOrders = async (req, res) => {
//     /**Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
//     let page = +req.query.page || 1
//     const limit = +req.query.limit || 30
//     const skip = (page - 1) * limit
//     const startDate = req.query.startDate || new Date('2000-01-01')
//     const endDate = req.query.endDate || new Date()
//     const { company = '', paytype = '', marktercode = '', keyword = '' } = req.query
//     // , billCode = ''

//     try {
//         console.time('block')
//         let matchObj = {}
//         if (!company && !paytype && !marktercode && !keyword) {
//             matchObj = {}
//         } else if (!keyword) {
//             matchObj = {
//                 paytype: { $regex: paytype, $options: 'i' },// $options: 'i' to make it case-insensitive (accept capital or small chars)
//                 marktercode: { $regex: marktercode, $options: 'i' },
//                 company: { $regex: company, $options: 'i' },
//                 // "data.awb_no": { $regex: billCode, $options: 'i' },
//                 created_at: {
//                     $gte: startDate,
//                     $lte: endDate
//                 },
//                 status: { $ne: "failed" },
//             }
//         } else {
//             matchObj = {
//                 paytype: { $regex: paytype, $options: 'i' },// $options: 'i' to make it case-insensitive (accept capital or small chars)
//                 marktercode: { $regex: marktercode, $options: 'i' },
//                 company: { $regex: company, $options: 'i' },
//                 // "data.awb_no": { $regex: billCode, $options: 'i' },
//                 created_at: {
//                     $gte: startDate,
//                     $lte: endDate
//                 },
//                 status: { $ne: "failed" },
//                 $or: [
//                     { 'user.name': { $regex: keyword, $options: 'i' } },
//                     { 'user.email': { $regex: keyword, $options: 'i' } },
//                     { 'user.mobile': { $regex: keyword, $options: 'i' } }
//                 ]
//             }
//         }

//         const orders = await Order.aggregate([
//             {
//                 $lookup: { // populate with user data
//                     from: 'users', // collection name in mongoDB
//                     localField: 'user',
//                     foreignField: '_id',
//                     as: 'user'
//                 }
//             },
//             {
//                 $match: matchObj
//             },
//             {
//                 $group: {
//                     _id: null,
//                     count: { $sum: 1 },
//                     data: { $push: '$$ROOT' }
//                 },
//             },
//             // { $skip: skip },
//             // { $limit: limit },
//             { $sort: { created_at: -1 } },
//             {
//                 $project: { // select
//                     // "__v": 0,
//                     // "user.password": 0,
//                     // "user.address": 0,
//                     // "user.location": 0,
//                     // "user.emailcode": 0,
//                     // "user.verified": 0,
//                     // "user.rolle": 0,
//                     // "user.wallet": 0,
//                     // "user.cr": 0,
//                     // "user.iscrproofed": 0,
//                     // "user.__v": 0,
//                     // "user.daftraid": 0,
//                     // "user.package": 0,
//                     // "user.daftraClientId": 0,
//                     count: 1,
//                     data: { $slice: ['$data', skip, limit] },
//                 }
//             }
//         ])

//         // const allOrdersPromise = Order.aggregate([
//         //     {
//         //         $lookup: {
//         //             from: 'users',
//         //             localField: 'user',
//         //             foreignField: '_id',
//         //             as: 'user'
//         //         }
//         //     },
//         //     {
//         //         $match: {
//         //             paytype: { $regex: paytype, $options: 'i' },// $options: 'i' to make it case-insensitive (accept capital or small chars)
//         //             marktercode: { $regex: marktercode, $options: 'i' },
//         //             company: { $regex: company, $options: 'i' },
//         //             // "data.awb_no": { $regex: billCode, $options: 'i' },
//         //             created_at: {
//         //                 $gte: startDate,
//         //                 $lte: endDate
//         //             },
//         //             status: { $ne: "failed" },
//         //             $or: [
//         //                 { 'user.name': { $regex: keyword, $options: 'i' } },
//         //                 { 'user.email': { $regex: keyword, $options: 'i' } },
//         //                 { 'user.mobile': { $regex: keyword, $options: 'i' } }
//         //             ]
//         //         }
//         //     },
//         //     {
//         //         $group: {
//         //             _id: null,
//         //             count: { $sum: 1 }
//         //         }
//         //     }
//         // ])
//         // const [orders, allOrders] = await Promise.all([ordersPromise, allOrdersPromise])

//         let numberOfOrders, numberOfPages = 0
//         if (orders[0]) {
//             numberOfOrders = orders[0].count
//             numberOfPages = (numberOfOrders % limit == 0) ? numberOfOrders / limit : Math.floor(numberOfOrders / limit) + 1;
//         }

//         console.timeEnd('block')
//         res.status(200).json({
//             result: orders[0].data.length,
//             pagination: {
//                 currentPage: page,
//                 limit,
//                 numberOfPages
//             },
//             ...orders[0]
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             error: err.message
//         })
//     }
// }

exports.getOrders = async (req, res) => {
    /**Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
    let page = +req.query.page || 1
    const limit = +req.query.limit || 30
    const skip = (page - 1) * limit
    const startDate = req.query.startDate || new Date('2000-01-01')
    const endDate = req.query.endDate || new Date()
    const { company = '', paytype = '', billCode = '', marktercode = '', keyword = '' } = req.query

    try {
        console.time('block')
        let matchObj = {}
        if (!company && !paytype && !billCode && !marktercode && !keyword) {
            matchObj = {}
        } else if (!keyword) {
            matchObj = {
                paytype: { $regex: paytype, $options: 'i' },// $options: 'i' to make it case-insensitive (accept capital or small chars)
                marktercode: { $regex: marktercode, $options: 'i' },
                company: { $regex: company, $options: 'i' },
                billCode: { $regex: billCode, $options: 'i' },
                created_at: {
                    $gte: startDate,
                    $lte: endDate
                },
                status: { $ne: "failed" },
            }
        } else {
            matchObj = {
                paytype: { $regex: paytype, $options: 'i' },// $options: 'i' to make it case-insensitive (accept capital or small chars)
                marktercode: { $regex: marktercode, $options: 'i' },
                company: { $regex: company, $options: 'i' },
                billCode: { $regex: billCode, $options: 'i' },
                created_at: {
                    $gte: startDate,
                    $lte: endDate
                },
                status: { $ne: "failed" },
                $or: [
                    { 'user.name': { $regex: keyword, $options: 'i' } },
                    { 'user.email': { $regex: keyword, $options: 'i' } },
                    { 'user.mobile': { $regex: keyword, $options: 'i' } }
                ]
            }
        }

        const ordersPromise = Order.aggregate([
            {
                $lookup: { // populate with user data
                    from: 'users', // collection name in mongoDB
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'markters',
                    localField: 'marktercode',
                    foreignField: 'code',
                    as: 'marketer'
                }
            },
            {
                $match: matchObj
            },
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: { // select
                    "__v": 0,
                    "user.password": 0,
                    "user.address": 0,
                    "user.location": 0,
                    "user.emailcode": 0,
                    "user.verified": 0,
                    "user.rolle": 0,
                    "user.wallet": 0,
                    "user.cr": 0,
                    "user.iscrproofed": 0,
                    "user.__v": 0,
                    "user.daftraid": 0,
                    "user.package": 0,
                    "user.daftraClientId": 0,

                    "marketer._id": 0,
                    "marketer.password": 0,
                    "marketer.email": 0,
                    "marketer.mobile": 0,
                    "marketer.code": 0,
                    "marketer.__v": 0,
                }
            }
        ])

        // to count number of filtered orders 
        const allOrdersPromise = Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $match: matchObj
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ])
        const [orders, allOrders] = await Promise.all([ordersPromise, allOrdersPromise])


        // const myOrders = await Order.find({})
        // myOrders.forEach(async (order) => {
        //     switch (order.company) {
        //         case 'anwan':
        //             order.billCode = order.data.awb_no
        //             break;
        //         case 'aramex':
        //             console.log(order.data.Shipments[0])
        //             if (order.data.Shipments[0]) {
        //                 order.billCode = order.data.Shipments["ID"]
        //             }
        //             break;
        //         case 'imile':
        //             if (order.data.code == "200") {
        //                 order.billCode = order.data.data.expressNo
        //             }
        //             break;
        //         case 'jt':
        //             if (order.data.msg == "success") {
        //                 console.log(order.data.data.billCode)
        //                 order.billCode = order.data.data.billCode
        //             }
        //             break;
        //         case 'saee':
        //             order.billCode = order.data.waybill
        //             break;
        //         case 'smsa':
        //             order.billCode = order.data.sawb
        //             break;
        //         case 'spl':
        //             order.billCode = order.data.Items.Barcode
        //             break;
        //         default:
        //             break;
        //     }
        //     order.billCode = order.billCode || ''
        //     await order.save()
        // })


        let numberOfOrders, numberOfPages = 0
        if (allOrders[0]) {
            numberOfOrders = allOrders[0].count
            numberOfPages = (numberOfOrders % limit == 0) ? numberOfOrders / limit : Math.floor(numberOfOrders / limit) + 1;
        }

        console.timeEnd('block')
        res.status(200).json({
            result: orders.length,
            pagination: {
                currentPage: page,
                limit,
                numberOfPages
            },
            data: orders
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        })
    }
}

exports.getOrderById = async (req, res) => {
    const orderId = req.params.orderId

    try {
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(400).json({ error: "Order not found" })
        }

        res.status(200).json({
            data: order
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        })
    }
}


exports.cancelOrderRequest = async (req, res) => {
    const { orderId, cancelReason = "" } = req.body;
    const userId = req.user.user.id
    const order = await Order.findById(orderId);

    try {
        if (!order || order.user != userId) {
            return res.status(400).json({
                err: "order not found"
            })
        }
        if (order.status == 'canceled') {
            return res.status(400).json({
                err: "This order is already canceled"
            })
        }

        order.cancel.request = true
        order.cancelReason = cancelReason
        await order.save()

        return res.status(200).json({ msg: "Your canceling request is saved. Wait until admin accept it." })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err.message
        })
    }
}

exports.cancelOrderRequestStatus = async (req, res) => {
    const { orderId, requestStatus } = req.body;
    const order = await Order.findById(orderId);

    try {
        if (!order) {
            return res.status(400).json({
                err: "order not found"
            })
        }
        if (order.status == 'canceled') {
            return res.status(400).json({
                err: "This order is already canceled"
            })
        }

        order.cancel.requestStatus = requestStatus
        if (requestStatus == 'accepted') {
            order.status = 'canceled'

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

        await order.save()
        return res.status(200).json({ msg: "ok" })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err.message
        })
    }
}


exports.getCancelOrderRequests = async (req, res) => {
    try {
        const anwanOrderPromise = AnwanOrder.find({ "cancel.request": true });
        const aramexOrderPromise = AramexOrder.find({ "cancel.request": true });
        const smsaOrderPromise = SmsaOrder.find({ "cancel.request": true });
        const splOrderPromise = SplOrder.find({ "cancel.request": true });

        const [anwanOrder, aramexOrder, smsaOrder, splOrder] = await Promise.all([anwanOrderPromise, aramexOrderPromise, smsaOrderPromise, splOrderPromise])
        const orders = [...anwanOrder, ...aramexOrder, ...smsaOrder, ...splOrder]

        return res.status(200).json({ orders })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err.message
        })
    }
}