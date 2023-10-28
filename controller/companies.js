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
const User = require("../model/user");

exports.getAllCompanies = async (req, res) => {
    try {
        const anwan = await Anwan.findOne();
        const aramex = await Aramex.findOne();
        const glt = await Glt.findOne();
        const imile = await Imile.findOne();
        const jt = await Jt.findOne();
        const saee = await Saee.findOne();
        const smsa = await Smsa.findOne();
        const spl = await Spl.findOne();
        let companies = [saee, glt, smsa, aramex, anwan, imile, jt, spl];
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

exports.getAllOrders = async (req, res) => {
    try {
        const gltorders = await GltOrder.find({ status: { $ne: "failed" } }).populate("user");
        const aramexorders = await AramexOrder.find({ status: { $ne: "failed" } }).populate("user");
        const anwanorders = await AnwanOrder.find({ status: { $ne: "failed" } }).populate("user");
        const imileorders = await ImileOrder.find({ status: { $ne: "failed" } }).populate("user");
        const jtorders = await JtOrder.find({ status: { $ne: "failed" } }).populate("user");
        const saeeorders = await SaeeOrder.find({ status: { $ne: "failed" } }).populate("user");
        const smsaorders = await SmsaOrder.find({ status: { $ne: "failed" } }).populate("user");
        const splorders = await SplOrder.find({ status: { $ne: "failed" } }).populate("user");
        let orders = [...saeeorders, ...gltorders, ...aramexorders, ...smsaorders, ...anwanorders, ...imileorders, ...jtorders, ...splorders];
        res.status(200).json({
            result: orders.length,
            data: orders
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: err.message
        })
    }

}

/**
 * @Desc :  Filter with company, paytype or billCode
 *        + Pagination
 */
// TODO: Add Glt orders
exports.allOrders = async (req, res) => {
    /** Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
    const { page = 1, limit = 30, company, paytype = '', billCode = '' } = req.query
    //?Note: marktercode = '' doesn't work if I don't send it, it gives only orders with marktercode key

    try {
        const anwanOrders = await AnwanOrder.find({
            paytype: { $regex: paytype, $options: 'i' },// $options: 'i' to make it case-insensitive (accept capital or small chars)
            "data.awb_no": { $regex: billCode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const aramexOrders = await AramexOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            "data.Shipments.ID": { $regex: billCode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const imileOrders = await ImileOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            "data.data.expressNo": { $regex: billCode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const jtOrders = await JtOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            "data.data.billCode": { $regex: billCode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const saeeOrders = await SaeeOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            "data.waybill": { $regex: billCode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const smsaOrders = await SmsaOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            "data.sawb": { $regex: billCode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const splOrders = await SplOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            "data.Items.Barcode": { $regex: billCode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");

        let orders = []
        /** Filter by company */
        switch (company) {
            case 'anwan':
                orders = anwanOrders
                break;
            case 'aramex':
                orders = aramexOrders
                break;
            case 'imile':
                orders = imileOrders
                break;
            case 'jt':
                orders = jtOrders
                break;
            case 'saee':
                orders = saeeOrders
                break;
            case 'smsa':
                orders = smsaOrders
                break;
            case 'spl':
                orders = splOrders
                break;
            default:
                orders = [...anwanOrders, ...saeeOrders, ...aramexOrders, ...smsaOrders, ...imileOrders, ...jtOrders, ...splOrders];
                break;
        }
        const ordersPagination = paginate(orders, page, limit)

        res.status(200).json({ ...ordersPagination })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        })
    }

}
exports.filterByClientData = async (req, res) => {
    /**Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
    const { page = 1, limit = 30, keyword = '' } = req.query

    try {
        const anwanOrders = await AnwanOrder.find({
            status: { $ne: "failed" }
        }).populate({
            path: 'user',
            /**@Desc if users.name or user.email != keyword, it returns user=null */
            match: {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { mobile: { $regex: keyword, $options: 'i' } }
                ]
            }
        });
        const aramexOrders = await AramexOrder.find({
            status: { $ne: "failed" }
        }).populate({
            path: 'user',
            match: {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { mobile: { $regex: keyword, $options: 'i' } }
                ]
            }
        });
        const imileOrders = await ImileOrder.find({
            status: { $ne: "failed" }
        }).populate({
            path: 'user',
            match: {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { mobile: { $regex: keyword, $options: 'i' } }
                ]
            }
        });
        const jtOrders = await JtOrder.find({
            status: { $ne: "failed" }
        }).populate({
            path: 'user',
            match: {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { mobile: { $regex: keyword, $options: 'i' } }
                ]
            }
        });
        const saeeOrders = await SaeeOrder.find({
            status: { $ne: "failed" }
        }).populate({
            path: 'user',
            match: {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { mobile: { $regex: keyword, $options: 'i' } }
                ]
            }
        });
        const smsaOrders = await SmsaOrder.find({
            status: { $ne: "failed" }
        }).populate({
            path: 'user',
            match: {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { mobile: { $regex: keyword, $options: 'i' } }
                ]
            }
        });
        const splOrders = await SplOrder.find({
            status: { $ne: "failed" }
        }).populate({
            path: 'user',
            match: {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { mobile: { $regex: keyword, $options: 'i' } }
                ]
            }
        });

        let orders = [...anwanOrders, ...saeeOrders, ...aramexOrders, ...smsaOrders, ...imileOrders, ...jtOrders, ...splOrders];
        orders = orders.filter(order => order.user) // filter orders to remove user=null
        const ordersPagination = paginate(orders, page, limit)

        res.status(200).json({ ...ordersPagination })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        })
    }
}

exports.filterByPrice = async (req, res) => {
    /**Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
    const { page = 1, limit = 30, minPrice = 0, maxPrice = 100000 } = req.query

    try {
        const anwanOrders = await AnwanOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate("user");
        const aramexOrders = await AramexOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate("user");
        const imileOrders = await ImileOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate("user");
        const jtOrders = await JtOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate("user");
        const saeeOrders = await SaeeOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate("user");
        const smsaOrders = await SmsaOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate("user");
        const splOrders = await SplOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate("user");

        const orders = [...anwanOrders, ...saeeOrders, ...aramexOrders, ...smsaOrders, ...imileOrders, ...jtOrders, ...splOrders];
        const ordersPagination = paginate(orders, page, limit)

        res.status(200).json({ ...ordersPagination })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        })
    }
}
exports.filterByMarketerCode = async (req, res) => {
    /**Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
    const { page = 1, limit = 30, marktercode = '' } = req.query

    try {
        const anwanOrders = await AnwanOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const aramexOrders = await AramexOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const imileOrders = await ImileOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const jtOrders = await JtOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const saeeOrders = await SaeeOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const smsaOrders = await SmsaOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");
        const splOrders = await SplOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate("user");

        const orders = [...anwanOrders, ...saeeOrders, ...aramexOrders, ...smsaOrders, ...imileOrders, ...jtOrders, ...splOrders];
        const ordersPagination = paginate(orders, page, limit)

        res.status(200).json({ ...ordersPagination })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        })
    }
}
exports.filterByDate = async (req, res) => {
    /**Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
    const { page = 1, limit = 30, startDate = '', endDate = new Date() } = req.query

    try {
        const anwanOrders = await AnwanOrder.find({
            createdate: {
                // $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate("user");
        const aramexOrders = await AramexOrder.find({
            createdate: {
                // $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate("user");
        const imileOrders = await ImileOrder.find({
            createdate: {
                // $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate("user");
        const jtOrders = await JtOrder.find({
            createdate: {
                // $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate("user");
        const saeeOrders = await SaeeOrder.find({
            createdate: {
                // $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate("user");
        const smsaOrders = await SmsaOrder.find({
            createdate: {
                // $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate("user");
        const splOrders = await SplOrder.find({
            createdate: {
                // $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate("user");

        const orders = [...anwanOrders, ...saeeOrders, ...aramexOrders, ...smsaOrders, ...imileOrders, ...jtOrders, ...splOrders];
        const ordersPagination = paginate(orders, page, limit)

        res.status(200).json({ ...ordersPagination })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        })
    }
}

/** pagination*/
const paginate = (orders, page, limit) => {
    const skip = (page - 1) * limit

    const numberOfOrders = orders.length
    const numberOfPages = (numberOfOrders % limit == 0) ? numberOfOrders / limit : Math.floor(numberOfOrders / limit) + 1;
    const ordersPerPage = orders.sort((a, b) => new Date(b.createdate) - new Date(a.createdate)) // sort desc
        .slice(skip, skip + limit)

    return {
        result: ordersPerPage.length,
        pagination: {
            currentPage: page,
            limit,
            numberOfPages
        },
        data: ordersPerPage
    }
}