const Imile = require("../model/imile");
const axios = require("axios");
const Client = require("../model/clint");
const { editImileClient } = require('../controller/clients/imileClients')

/** edit client city & address + mobile in case of using another mobile number */
exports.beforeCreateOrder = async (req, res, next) => {
    const { clintid, p_city, p_address, p_mobile } = req.body
    try {
        // check if p_city & p_address sent means user chose a branch || p_mobile sent means user chose another mobile number
        if (clintid && p_city && p_address || clintid && p_mobile) {
            const client = await Client.findById(clintid);
            if (!client) {
                return res.status(404).json({ msg: 'No client for this id' })
            }

            const editImileParams = {
                company: client.company,
                name: client.name,
                city: p_city || client.city,
                address: p_address || client.address,
                mobile: p_mobile || client.mobile,
                notes: client.notes
            }

            const imileResult = await editImileClient(editImileParams);
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
    const { clintid, p_city, p_address, p_mobile } = req.body
    try {
        if (clintid && p_city && p_address || clintid && p_mobile) {
            const client = await Client.findById(clintid);
            if (!client) {
                return res.status(404).json({ msg: 'No client for this id' })
            }

            const imileResult = await editImileClient(client.company, client.name, client.city, client.address, client.mobile, client.notes);
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