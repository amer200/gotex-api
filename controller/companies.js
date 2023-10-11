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
            msg: err
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
            data: orders
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: err
        })
    }

}