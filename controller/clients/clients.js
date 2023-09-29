const Client = require("../../model/clint");
const User = require("../../model/user");
const Imile = require("../../model/imile");
const axios = require("axios");


exports.addClient = async (req, res) => {
    const userId = req.user.user.id;
    const { company, first_name, last_name, city, state, address, mobile, email,
        notes, category, birth_date, street } = req.body

    try {
        const name = `${first_name} ${last_name}`;
        let staff_id = 0;

        if (!first_name) {
            return res.status(400).json({ msg: "first_name is required" })
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

        const usedEmail = await Client.findOne({ email })
        if (usedEmail) {
            return res.status(400).json({ msg: "This client email is already used." })
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
        const myClient = new Client({
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
            orders: [],
            daftraClientId: daftraResult.id
        })
        await myClient.save();
        return res.status(200).json({
            data: myClient
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
}

exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({})

        return res.status(200).json({ data: clients })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }
}
exports.editClient = async (req, res) => {
    const clientId = req.params.id
    const userId = req.user.user.id;
    const { company, first_name, last_name, city, state, address, mobile, email,
        notes, category, birth_date, street } = req.body

    try {
        const name = `${first_name} ${last_name}`;
        if (!company || !first_name || !last_name || !city || !state || !address || !mobile || !email || !notes || !category || !birth_date || !street) {
            return res.status(400).json({
                msg: 'These all info are required: company, first_name, last_name, city, state, address, mobile, email, notes, category, birth_date and street'
            })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: `No user for this id ${userId}` })
        }
        staff_id = user.daftraid;

        const client = await Client.findOne({ _id: clientId })
        if (!client) {
            return res.status(400).json({ msg: `No client for this id ${clientId}` })
        }

        const usedEmail = await Client.findOne({ email })
        if (usedEmail && (usedEmail.email !== client.email)) {
            return res.status(400).json({ msg: "This client email is already used." })
        }

        const daftraResult = await editDaftraClient(staff_id, company, first_name, last_name, email, address, city, state, mobile, notes, category, birth_date, client.daftraClientId);
        if (daftraResult.result != "ok") {
            return res.status(400).json({
                msg: "error with daftra",
                err: daftraResult
            })
        }

        const imileResult = await editImileClient(company, name, city, address, mobile, email, notes);
        if (imileResult != 1) {
            // await removeDaftraClient(daftraResult.id)
            return res.status(400).json({ msg: "error with imile", err: imileResult })
        }

        const updatedClient = await Client.findOneAndUpdate(
            { _id: clientId },
            {
                company,
                name,
                city,
                address,
                mobile,
                email,
                notes
            },
            { new: true })

        res.status(200).json({ data: updatedClient })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
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

const editDaftraClient = async (staff_id, company, first_name, last_name, email, address, city, state, mobile, notes, category, birth_date, daftraClientId) => {
    let data = JSON.stringify({
        "Client": {
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
    });

    let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://aljwadalmomez.daftra.com/api2/clients/${daftraClientId}`,
        headers: {
            'APIKEY': process.env.daftra_Key,
            'Content-Type': 'application/json',
        },
        data: data
    };

    console.log('*****')
    const response = await axios(config);
    console.log('*****')
    console.log(response)
    if (response.data.result == "successful") {
        return {
            result: "ok",
            id: response.data.id
        }
    }
    return response.data
}
const getAllDaftraClientsPage = async (page) => {
    var p = page;
    const url = `https://aljwadalmomez.daftra.com/api2/clients?page=${p}`;
    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
            'APIKEY': process.env.daftra_Key
        }
    }
    const response = await axios(config);
    let clients = response.data.data;
    let page_count = response.data.pagination.page_count;
    let myPage = response.data.pagination.page;
    const result = {
        clients: clients,
        pageCount: page_count,
        myPage: myPage
    }
    return result
}

const editImileClient = async (company, name, city, address, mobile, email, notes) => {
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
        maxBodyLength: Infinity,
        url: 'https://openapi.imile.com/client/consignor/modify',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    const response = await axios(config);
    if (response.data.message !== 'success') {
        // return res.status(400).json({ msg: response.data })
        return response.data
    }

    return 1

    // const updatedClient = await ImileClient.findOneAndUpdate(
    //     { _id: clientId },
    //     {
    //         company,
    //         name,
    //         city,
    //         address,
    //         phone,
    //         email,
    //         notes
    //     },
    //     { new: true })

    // if (!updatedClient) {
    //     res.status(404).json(`No client for this id ${clientId}`)
    // }

    // res.status(200).json({ data: updatedClient })
}