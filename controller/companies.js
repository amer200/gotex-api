const Anwan = require("../model/anwan");
const Aramex = require("../model/aramex");
const Imile = require("../model/imile");
const Glt = require("../model/glt");
const Jt = require("../model/jt");
const Saee = require("../model/saee");
const Smsa = require("../model/smsa");
const Spl = require("../model/spl");
const AnwanOrder = require("../model/anwanorders");
const AramexOrder = require("../model/aramexorders");
const ImileOrder = require("../model/imileorders");
const JtOrder = require("../model/jtorders");
const GltOrder = require("../model/gltorders");
const SaeeOrder = require("../model/saeeorders");
const SmsaOrder = require("../model/smsaorders");
const SplOrder = require("../model/splorders");
const paginate = require("../modules/paginate");

exports.getAllCompanies = async (req, res) => {
    try {
        const anwanPromise = Anwan.findOne();
        const aramexPromise = Aramex.findOne();
        const gltPromise = Glt.findOne();
        const imilePromise = Imile.findOne();
        const jtPromise = Jt.findOne();
        const saeePromise = Saee.findOne();
        const smsaPromise = Smsa.findOne();
        const splPromise = Spl.findOne();
        let companies = await Promise.all([anwanPromise, aramexPromise, gltPromise, imilePromise, jtPromise, saeePromise, smsaPromise, splPromise]);

        res.status(200).json({
            data: companies
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err.message
        })
    }
}

/**
 * @Desc :  Filter with company, paytype, billCode, marktercode or keyword (user data -> name, email or mobile)
 *        + Filter by date
 *        + Pagination
 */
// TODO: Add Glt orders
exports.allOrders = async (req, res) => {
    /** Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
    let page = +req.query.page || 1
    const limit = +req.query.limit || 30
    const startDate = req.query.startDate || new Date('2000-01-01')
    const endDate = req.query.endDate || new Date()
    const { company, paytype = '', billCode = '', marktercode = '', keyword = '' } = req.query

    try {
        console.time('blocking await')
        const query = {
            paytype: { $regex: paytype, $options: 'i' },// $options: 'i' to make it case-insensitive (accept capital or small chars)
            marktercode: { $regex: marktercode, $options: 'i' },
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }

        const populateObj = [{
            path: 'user',
            /**@Desc if users.name or user.email != keyword, it returns user=null */
            match: {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { mobile: { $regex: keyword, $options: 'i' } }
                ]
            },
            select: "name email mobile"
        },
        {
            path: 'markters',
            options: { strictPopulate: false },
            select: "name"
        }
        ]

        const anwanOrders = AnwanOrder.find({
            ...query,
            "data.awb_no": { $regex: billCode, $options: 'i' }
        }).populate(populateObj);
        const aramexOrders = AramexOrder.find({
            ...query,
            "data.Shipments.ID": { $regex: billCode, $options: 'i' }
        }).populate(populateObj);
        const imileOrders = ImileOrder.find({
            ...query,
            "data.data.expressNo": { $regex: billCode, $options: 'i' }
        }).populate(populateObj);
        const jtOrders = JtOrder.find({
            ...query,
            "data.data.billCode": { $regex: billCode, $options: 'i' }
        }).populate(populateObj);
        const saeeOrders = SaeeOrder.find({
            ...query,
            "data.waybill": { $regex: billCode, $options: 'i' }
        }).populate(populateObj);
        const smsaOrders = SmsaOrder.find({
            ...query,
            "data.sawb": { $regex: billCode, $options: 'i' }
        }).populate(populateObj);
        const splOrders = SplOrder.find({
            ...query,
            "data.Items.Barcode": { $regex: billCode, $options: 'i' }
        }).populate(populateObj);

        /** Filter by company */
        let orders = []
        switch (company) {
            case 'anwan':
                orders = await anwanOrders
                break;
            case 'aramex':
                orders = await aramexOrders
                break;
            case 'imile':
                orders = await imileOrders
                break;
            case 'jt':
                orders = await jtOrders
                break;
            case 'saee':
                orders = await saeeOrders
                break;
            case 'smsa':
                orders = await smsaOrders
                break;
            case 'spl':
                orders = await splOrders
                break;
            default:
                // Use promise.all to ensure that these promises are executed in parallel.
                const [anwanOrdersRes, aramexOrdersRes, imileOrdersRes, jtOrdersRes, saeeOrdersRes, smsaOrdersRes, splOrdersRes] = await Promise.all([anwanOrders, aramexOrders, imileOrders, jtOrders, saeeOrders, smsaOrders, splOrders]);
                orders = [...anwanOrdersRes, ...saeeOrdersRes, ...aramexOrdersRes, ...smsaOrdersRes, ...imileOrdersRes, ...jtOrdersRes, ...splOrdersRes];
                break;
        }

        if (keyword) {
            orders = orders.filter(order => order.user) // filter orders to remove user=null
        }

        const ordersPagination = paginate(orders, page, limit)
        console.timeEnd('blocking await')
        res.status(200).json({ ...ordersPagination })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        })
    }
}
// exports.allOrders = async (req, res) => {
//     /** Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
//     let page = +req.query.page || 1
//     const limit = +req.query.limit || 30
//     const skip = (page - 1) * limit
//     const startDate = req.query.startDate || new Date('2000-01-01')
//     const endDate = req.query.endDate || new Date()
//     const { paytype = '', billCode = '', marktercode = '', keyword = '' } = req.query

//     try {
//         console.time('blocking await')
//         const query = {
//             paytype: { $regex: paytype, $options: 'i' },// $options: 'i' to make it case-insensitive (accept capital or small chars)
//             marktercode: { $regex: marktercode, $options: 'i' },
//             created_at: {
//                 $gte: startDate,
//                 $lte: endDate
//             },
//             status: { $ne: "failed" }
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

//         let dataPerPage = await SaeeOrder.find({
//             ...query,
//             "data.waybill": { $regex: billCode, $options: 'i' }
//         }).limit(limit).skip(skip).sort({ created_at: -1 }).populate(populateObj)

//         const numberOfOrders = await SaeeOrder.find({
//             ...query,
//             "data.waybill": { $regex: billCode, $options: 'i' }
//         }).countDocuments()
//         const numberOfPages = (numberOfOrders % limit == 0) ? numberOfOrders / limit : Math.floor(numberOfOrders / limit) + 1;


//         if (keyword) {
//             dataPerPage = dataPerPage.filter(dataPerPage => dataPerPage.user) // filter orders to remove user=null
//         }

//         // const ordersPagination = paginate(orders, page, limit)
//         console.timeEnd('blocking await')
//         res.status(200).json({
//             result: dataPerPage.length,
//             pagination: {
//                 currentPage: page,
//                 limit,
//                 numberOfPages
//             },
//             data: dataPerPage
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             error: err.message
//         })
//     }
// }