const axios = require("axios");
const Glt = require("../model/glt");
//const GltOrder = require("../model/gltorders");
exports.edit = (req, res) => {
    const status = req.body.status;
    const userprice = req.body.userprice;
    const marketerprice = req.body.marketerprice;
    const kgprice = req.body.kgprice;
    Glt.findOne()
        .then(g => {
            g.status = status;
            g.userprice = userprice;
            g.marketerprice = marketerprice;
            g.kgprice = kgprice;
            return g.save()
        })
        .then(g => {
            res.status(200).json({
                msg: "ok"
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                msg: err.message
            })
        })
}
exports.createUserOrder = async (req, res) => {
    const glt = await Glt.findOne();
    /************************** */
    const pieces = req.body.pieces;
    const desc = req.body.decription;
    const comment = req.body.clintComment;
    const value = req.body.value;
    const weight = req.body.weight;
    /*************************** */
    const s_address = req.body.s_address;
    const s_city = req.body.s_city;
    const s_mobile = req.body.s_mobile;
    const sender = req.body.s_name;
    /************************* */
    const c_name = req.body.c_name;
    const c_address = req.body.c_address;
    const c_areaName = req.body.c_areaName;
    const c_city = req.body.c_city;
}