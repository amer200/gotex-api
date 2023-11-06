const Imile = require("../model/imile");
const axios = require("axios");
const Client = require("../model/clint");
const { editImileClient } = require('../controller/clients/imileClients')

/** edit client city & address */
exports.beforeCreateOrder = async (req, res, next) => {
    const { clintid, p_city, p_address } = req.body
    try {
        // check if p_city & p_address sent means user chose a branch
        if (clintid && p_city && p_address) {
            const client = await Client.findById(clintid);
            if (!client) {
                return res.status(404).json({ msg: 'No client for this id' })
            }
            console.log("*****")
            console.log(client)

            const imileResult = await editImileClient(client.company, client.name, p_city, p_address, client.mobile, client.email, client.notes);
            if (imileResult != 1) {
                return res.status(400).json({ msg: "error with imile", err: imileResult })
            }

            next()
        } else {
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err.message
        })
    }
}

exports.afterCreateOrder = async (req, res, next) => {
    const { clintid, p_city, p_address } = req.body
    try {
        if (clintid && p_city && p_address) {
            const client = await Client.findById(clintid);
            if (!client) {
                return res.status(404).json({ msg: 'No client for this id' })
            }
            console.log(client)

            const imileResult = await editImileClient(client.company, client.name, client.city, client.address, client.mobile, client.email, client.notes);
            if (imileResult != 1) {
                return res.status(400).json({ msg: "error with imile", err: imileResult })
            }

            next()
        } else {
            next()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err.message
        })
    }
}