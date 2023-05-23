const Saee = require("../model/saee");
const SaeeOrder = require("../model/saeeorders");
const Glt = require("../model/glt");
const GltOrder = require("../model/gltorders");
const Smsa = require("../model/smsa");
exports.getAllCompanies = async (req, res) => {
    try {
        const saee = await Saee.findOne();
        const glt = await Glt.findOne();
        const smsa = await Smsa.findOne();
        let companies = [saee, glt, smsa];
        res.status(200).json({
            data: companies
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: err
        })
    }
}
exports.getAllOrders = async (req, res) => {
    try {
        const saeeorders = await SaeeOrder.find();
        const gltorders = await GltOrder.find();
        let orders = [...saeeorders, ...gltorders];
        res.status(200).json({
            data: orders
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: err
        })
    }

}