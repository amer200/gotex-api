const client = require("../../model/clint");
const User = require("../../model/user");
const Imile = require("../../model/imile");
const axios = require("axios");


exports.addClient = async (req, res) => {
    try {
        const company = req.body.company;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const name = `${first_name} ${last_name}`;
        const city = req.body.city;
        const state = req.body.state;
        const address = req.body.address;
        const mobile = req.body.mobile;
        const email = req.body.email;
        const notes = req.body.notes;
        const category = req.body.category;
        const birth_date = req.body.birth_date;
        const street = req.body.street;
        let staff_id = 0;
        const userId = req.user.user.id;
        if (!first_name) {
            return res.status(200).json({
                msg: "ffff"
            })
        }
        if (!company || !first_name || !last_name || !city || !state || !address || !mobile || !email || !notes || !category || !birth_date || !street) {
            return res.status(400).json({
                msg: req.body
            })
        }
        const user = await User.findById(userId);
        if (user.daftraid) {
            staff_id = user.daftraid;
        }
        const daftraResult = await addDaftraClient(staff_id, company, first_name, last_name, email, address, city, state, mobile, notes, category, birth_date);
        if (daftraResult.result != "ok") {
            return res.status(400).json({
                msg: "error with daftra",
                err: daftraResult
            })
        }
        const imileResult = await addImileClient(company, name, city, address, mobile, email, notes);
        if (imileResult != 1) {
            await removeDaftraClient(daftraResult.id)
            return res.status(400).json({
                msg: "error with imile",
                err: imileResult
            })
        }
        const myClient = new client({
            name: name,
            company: company,
            email: email,
            mobile: mobile,
            city: city,
            address: address,
            notes: notes,
            street: street,
            category: category,
            addby: userId,
            orders: []
        })
        await myClient.save();
        return res.status(200).json({
            data: myClient
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        })
    }
}
//************************************************************************************** */
const addImileClient = async (company, name, city, address, mobile, email, notes) => {
    const imile = await Imile.findOne();
    let data = JSON.stringify({
        "customerId": process.env.imile_customerid,
        "sign": process.env.imile_sign,
        "accessToken": imile.token,
        "signMethod": "SimpleKey",
        "format": "json",
        "version": "1.0.0",
        "timestamp": "1647727143355",
        "timeZone": "+4",
        "param": {
            "companyName": company,
            "contacts": name,
            "country": "KSA",
            "city": city,
            "area": "",
            "address": address,
            "phone": mobile,
            "email": email,
            "backupPhone": "",
            "attentions": notes,
            "defaultOption": "0"
        }
    });
    let config = {
        method: 'post',
        url: 'https://openapi.imile.com/client/consignor/add',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    const addRes = await axios(config);
    if (addRes.data.message !== 'success') {
        return addRes.data
    }
    return 1
}
const addDaftraClient = async (staff_id, company, first_name, last_name, email, address, city, state, mobile, notes, category, birth_date) => {
    let data = {
        Client: {
            "is_offline": true,
            "staff_id": staff_id,
            "business_name": company,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "address1": address,
            "city": city,
            "state": state,
            "phone1": mobile,
            "country_code": "SA",
            "notes": notes,
            "default_currency_code": "SAR",
            "category": category,
            "timezone": 0,
            "starting_balance": null,
            "type": 2,
            "birth_date": birth_date,
            "credit_limit": 0,
            "credit_period": 0
        }
    };
    let config = {
        method: 'post',
        url: 'https://aljwadalmomez.daftra.com/api2/clients',
        headers: {
            'APIKEY': process.env.daftra_Key,
            'Content-Type': 'application/json',
        },
        data: data
    };
    const response = await axios(config);

    if (response.data.result == "successful") {
        return {
            result: "ok",
            id: response.data.id
        }
    }
    return response.data
}
const removeDaftraClient = async (id) => {
    let config = {
        method: 'delete',
        url: `https://aljwadalmomez.daftra.com/api2/clients/${id}`,
        headers: {
            'APIKEY': process.env.daftra_Key,
            'Content-Type': 'application/json',
        }
    };
    await axios(config);
}