const Saee = require("../model/saee");
const SaeeOrder = require("../model/saeeorders");
const Glt = require("../model/glt");
const GltOrder = require("../model/gltorders");
const Aramex = require("../model/aramex");
const AramexOrder = require("../model/aramexorders");
const Smsa = require("../model/smsa");
const SmsaOrder = require("../model/smsaorders");
const Anwan = require("../model/anwan");
const AnwanOrder = require("../model/anwanorders");

exports.getAllCompanies = async (req, res) => {
    try {
        const saee = await Saee.findOne();
        const glt = await Glt.findOne();
        const aramex = await Aramex.findOne();
        const smsa = await Smsa.findOne();
        const anwan = await Anwan.findOne();
        let companies = [saee, glt, smsa, aramex, anwan];
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
        const saeeorders = await SaeeOrder.find().populate("user");
        const gltorders = await GltOrder.find().populate("user");
        const aramexorders = await AramexOrder.find().populate("user");
        const smsaorders = await SmsaOrder.find().populate("user");
        const anwanorders = await AnwanOrder.find().populate("user");
        let orders = [...saeeorders, ...gltorders, ...aramexorders, ...smsaorders, ...anwanorders];
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