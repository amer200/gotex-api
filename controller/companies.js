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

exports.getAllOrders = async (req, res) => {
    try {
        const anwanOrders = AnwanOrder.find({ status: { $ne: "failed" } }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const aramexOrders = AramexOrder.find({ status: { $ne: "failed" } }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        // const gltOrders = GltOrder.find({ status: { $ne: "failed" } }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const imileOrders = ImileOrder.find({ status: { $ne: "failed" } }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const jtOrders = JtOrder.find({ status: { $ne: "failed" } }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const saeeOrders = SaeeOrder.find({ status: { $ne: "failed" } }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const smsaOrders = SmsaOrder.find({ status: { $ne: "failed" } }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const splOrders = SplOrder.find({ status: { $ne: "failed" } }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const [anwanOrdersRes, aramexOrdersRes, imileOrdersRes, jtOrdersRes, saeeOrdersRes, smsaOrdersRes, splOrdersRes] = await Promise.all([anwanOrders, aramexOrders, imileOrders, jtOrders, saeeOrders, smsaOrders, splOrders]);
        orders = [...anwanOrdersRes, ...saeeOrdersRes, ...aramexOrdersRes, ...smsaOrdersRes, ...imileOrdersRes, ...jtOrdersRes, ...splOrdersRes];

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
        const anwanOrders = AnwanOrder.find({
            paytype: { $regex: paytype, $options: 'i' },// $options: 'i' to make it case-insensitive (accept capital or small chars)
            marktercode: { $regex: marktercode, $options: 'i' },
            "data.awb_no": { $regex: billCode, $options: 'i' },
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
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
        const aramexOrders = AramexOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            marktercode: { $regex: marktercode, $options: 'i' },
            "data.Shipments.ID": { $regex: billCode, $options: 'i' },
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
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
        const imileOrders = ImileOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            marktercode: { $regex: marktercode, $options: 'i' },
            "data.data.expressNo": { $regex: billCode, $options: 'i' },
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
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
        const jtOrders = JtOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            marktercode: { $regex: marktercode, $options: 'i' },
            "data.data.billCode": { $regex: billCode, $options: 'i' },
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
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
        const saeeOrders = SaeeOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            marktercode: { $regex: marktercode, $options: 'i' },
            "data.waybill": { $regex: billCode, $options: 'i' },
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
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
        const smsaOrders = SmsaOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            marktercode: { $regex: marktercode, $options: 'i' },
            "data.sawb": { $regex: billCode, $options: 'i' },
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
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
        const splOrders = SplOrder.find({
            paytype: { $regex: paytype, $options: 'i' },
            marktercode: { $regex: marktercode, $options: 'i' },
            "data.Items.Barcode": { $regex: billCode, $options: 'i' },
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
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

        // orders.forEach(order => {
        //     if (order.company = "smsa") {
        //         console.log(order.data.createDate.split('T'))
        //         if (order.data.createDate.split('T')[0] == '2023-11-11') {
        //             order.created_at = new Date('2023-11-11')
        //         }
        //     }
        // })

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
exports.filterByClientData = async (req, res) => {
    /**Pagination -> default: page=1, limit=30 (max number of items (orders) per page)*/
    const page = +req.query.page || 1
    const limit = +req.query.limit || 30
    const keyword = req.query.keyword || ''

    try {
        console.time('block')
        const anwanOrders = AnwanOrder.find({
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
        const aramexOrders = AramexOrder.find({
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
        const imileOrders = ImileOrder.find({
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
        const jtOrders = JtOrder.find({
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
        const saeeOrders = SaeeOrder.find({
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
        const smsaOrders = SmsaOrder.find({
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
        const splOrders = SplOrder.find({
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
        // Use promise.all to ensure that these promises are executed in parallel.
        const [anwanOrdersRes, aramexOrdersRes, imileOrdersRes, jtOrdersRes, saeeOrdersRes, smsaOrdersRes, splOrdersRes] = await Promise.all([anwanOrders, aramexOrders, imileOrders, jtOrders, saeeOrders, smsaOrders, splOrders]);
        let orders = [...anwanOrdersRes, ...saeeOrdersRes, ...aramexOrdersRes, ...smsaOrdersRes, ...imileOrdersRes, ...jtOrdersRes, ...splOrdersRes];

        orders = orders.filter(order => order.user) // filter orders to remove user=null
        const ordersPagination = paginate(orders, page, limit)
        console.timeEnd('block')
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
    const page = +req.query.page || 1
    const limit = +req.query.limit || 30
    const minPrice = +req.query.minPrice || 0
    const maxPrice = +req.query.maxPrice || 100000

    try {
        const anwanOrders = AnwanOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const aramexOrders = AramexOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const imileOrders = ImileOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const jtOrders = JtOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const saeeOrders = SaeeOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const smsaOrders = SmsaOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const splOrders = SplOrder.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });

        const [anwanOrdersRes, aramexOrdersRes, imileOrdersRes, jtOrdersRes, saeeOrdersRes, smsaOrdersRes, splOrdersRes] = await Promise.all([anwanOrders, aramexOrders, imileOrders, jtOrders, saeeOrders, smsaOrders, splOrders]);
        let orders = [...anwanOrdersRes, ...saeeOrdersRes, ...aramexOrdersRes, ...smsaOrdersRes, ...imileOrdersRes, ...jtOrdersRes, ...splOrdersRes];
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
    const page = +req.query.page || 1
    const limit = +req.query.limit || 30
    const marktercode = req.query.marktercode || ""

    try {
        const anwanOrders = AnwanOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const aramexOrders = AramexOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const imileOrders = ImileOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const jtOrders = JtOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const saeeOrders = SaeeOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const smsaOrders = SmsaOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const splOrders = SplOrder.find({
            marktercode: { $regex: marktercode, $options: 'i' },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });

        const [anwanOrdersRes, aramexOrdersRes, imileOrdersRes, jtOrdersRes, saeeOrdersRes, smsaOrdersRes, splOrdersRes] = await Promise.all([anwanOrders, aramexOrders, imileOrders, jtOrders, saeeOrders, smsaOrders, splOrders]);
        let orders = [...anwanOrdersRes, ...saeeOrdersRes, ...aramexOrdersRes, ...smsaOrdersRes, ...imileOrdersRes, ...jtOrdersRes, ...splOrdersRes];
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
    const page = +req.query.page || 1
    const limit = +req.query.limit || 30
    let { startDate = new Date('2000-01-01'), endDate = new Date() } = req.query

    try {
        const anwanOrders = AnwanOrder.find({
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const aramexOrders = AramexOrder.find({
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const imileOrders = ImileOrder.find({
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const jtOrders = JtOrder.find({
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const saeeOrders = SaeeOrder.find({
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const smsaOrders = SmsaOrder.find({
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });
        const splOrders = SplOrder.find({
            created_at: {
                $gte: startDate,
                $lte: endDate
            },
            status: { $ne: "failed" }
        }).populate({ path: "user", select: "-password -emailcode -verified -__v" });

        const [anwanOrdersRes, aramexOrdersRes, imileOrdersRes, jtOrdersRes, saeeOrdersRes, smsaOrdersRes, splOrdersRes] = await Promise.all([anwanOrders, aramexOrders, imileOrders, jtOrders, saeeOrders, smsaOrders, splOrders]);
        let orders = [...anwanOrdersRes, ...saeeOrdersRes, ...aramexOrdersRes, ...smsaOrdersRes, ...imileOrdersRes, ...jtOrdersRes, ...splOrdersRes];
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
    const ordersPerPage = orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // sort desc
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