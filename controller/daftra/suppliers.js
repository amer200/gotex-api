const axios = require('axios');
const Aramex = require("../../model/aramex");
const Anwan = require("../../model/anwan");
const Glt = require("../../model/glt");
const Imile = require("../../model/imile");
const Jt = require("../../model/jt");
const Saee = require("../../model/saee");
const Smsa = require("../../model/smsa");
const Spl = require("../../model/spl");

/**
 * @Desc : suppliers (shipment companies ex. saee)
 */
exports.addSupplier = async (req, res) => {
    const { business_name, city, address, state, phone, email, notes } = req.body

    try {
        const anwan = await Anwan.findOne();
        const aramex = await Aramex.findOne();
        const glt = await Glt.findOne();
        const imile = await Imile.findOne();
        const jt = await Jt.findOne();
        const saee = await Saee.findOne();
        const smsa = await Smsa.findOne();
        const spl = await Spl.findOne();
        let companies = [anwan, aramex, glt, imile, jt, saee, smsa, spl];

        const myCompany = companies.find(c => {
            return c.name == business_name
        })

        const staff_id = 0
        const data = {
            Supplier: {
                "is_offline": true,
                "supplier_number": 0,
                "staff_id": staff_id,
                "business_name": business_name,
                "first_name": "",
                "last_name": "",
                "email": email,
                "password": "",
                "address1": address,
                "address2": "",
                "city": city,
                "state": state,
                "postal_code": "",
                "phone1": phone,
                "phone2": "",
                "country_code": "SA",
                "notes": notes,
                "active_secondary_address": true,
                "secondary_name": "",
                "secondary_address1": "",
                "secondary_address2": "",
                "secondary_city": "",
                "secondary_state": "",
                "secondary_postal_code": "",
                "secondary_country_code": "",
                "language_code": "",
                "default_currency_code": "SAR",
                "follow_up_status": null,
                "bn1": "string",
                "bn1_label": "bn1_label",
                "bn2_label": "",
                "bn2": ""
            }
        }
        const config = {
            method: 'post',
            url: `https://aljwadalmomez.daftra.com/api2/suppliers.json`,
            headers: {
                'APIKEY': process.env.daftra_Key,
                'Content-Type': 'application/json'
            },
            data: data
        }
        const response = await axios(config)
        if (response.data.result != 'successful') {
            return res.status(400).json({ msg: response.data })
        }

        myCompany.daftraId = response.data.id
        await myCompany.save()

        res.status(200).json({ data: myCompany })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
}
exports.editSupplier = async (req, res) => {
    const supplierId = req.params.id
    const { business_name, city, address, state, phone, email, notes } = req.body

    try {
        const staff_id = 0
        const data = {
            Supplier: {
                "is_offline": true,
                "supplier_number": 0,
                "staff_id": staff_id,
                "business_name": business_name,
                "first_name": "",
                "last_name": "",
                "email": email,
                "password": "",
                "address1": address,
                "address2": "",
                "city": city,
                "state": state,
                "postal_code": "",
                "phone1": phone,
                "phone2": "",
                "country_code": "SA",
                "notes": notes,
                "active_secondary_address": true,
                "secondary_name": "",
                "secondary_address1": "",
                "secondary_address2": "",
                "secondary_city": "",
                "secondary_state": "",
                "secondary_postal_code": "",
                "secondary_country_code": "",
                "language_code": "",
                "default_currency_code": "SAR",
                "follow_up_status": null,
                "bn1": "string",
                "bn1_label": "bn1_label",
                "bn2_label": "",
                "bn2": ""
            }
        }

        const config = {
            method: 'put',
            url: `https://aljwadalmomez.daftra.com/api2/suppliers/${supplierId}`,
            headers: {
                'APIKEY': process.env.daftra_Key,
                'Content-Type': 'application/json'
            },
            data: data
        }
        const response = await axios(config)
        if (response.data.result != 'successful') {
            return res.status(400).json({ msg: response.data })
        }

        res.status(200).json({ data: response.data })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
}
exports.deleteSupplier = async (req, res) => {
    const supplierId = req.params.id

    try {
        const config = {
            method: 'delete',
            url: `https://aljwadalmomez.daftra.com/api2/suppliers/${supplierId}`,
            headers: {
                'APIKEY': process.env.daftra_Key,
                'Content-Type': 'application/json'
            }
        }
        const response = await axios(config)
        if (response.data.result != 'successful') {
            return res.status(400).json({ msg: response.data })
        }

        res.status(200).json({ msg: 'ok' })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
}

exports.getAllSuppliers = async (req, res) => {
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://aljwadalmomez.daftra.com/api2/suppliers?page=1&limit=1000`,
            headers: {
                'APIKEY': process.env.daftra_Key
            }
        }
        const response = await axios(config)
        if (response.data.result != 'successful') {
            return res.status(400).json({ msg: response.data })
        }

        res.status(200).json({ data: response.data })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
}
exports.getSupplierById = async (req, res) => {
    const supplierId = req.params.id

    try {
        const config = {
            method: 'get',
            url: `https://aljwadalmomez.daftra.com/api2/suppliers/${supplierId}`,
            headers: {
                'APIKEY': process.env.daftra_Key,
                'Content-Type': 'application/json'
            }
        }
        const response = await axios(config)
        if (response.data.result != 'successful') {
            return res.status(400).json({ msg: response.data })
        }

        res.status(200).json({ data: response.data })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
}