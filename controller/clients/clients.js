const Client = require("../../model/clint");
const Markter = require("../../model/marketer");
const User = require("../../model/user");
const Imile = require("../../model/imile");
const axios = require("axios");
const { addImileClient, editImileClient } = require("./imileClients")


exports.addClient = async (req, res) => {
    const userId = req.user.user.id;
    const { company, first_name, city, state, address, mobile, email,
        notes, category, birth_date, street, branches } = req.body

    try {
        const name = first_name
        let staff_id = 0;

        if (!first_name || !city || !address || !mobile || !street) {
            return res.status(400).json({
                msg: 'These info are required:  first_name, city, address, mobile and street'
            })
        }
        const user = await User.findById(userId);
        if (user.daftraid) {
            staff_id = user.daftraid;
        }

        // const usedEmail = await Client.findOne({ email })
        // if (usedEmail) {
        //     return res.status(400).json({ msg: "This client email is already used." })
        // }

        const daftraResult = await addDaftraClient(staff_id, company, first_name, email, address, city, state, mobile, notes, category, birth_date);
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
            name,
            company,
            email,
            mobile,
            city,
            address,
            notes,
            street,
            category,
            addby: userId,
            orders: [],
            daftraClientId: daftraResult.id,
            branches
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
    const { company, first_name, city, state, address, mobile, email,
        notes, category, birth_date, street, branches } = req.body

    try {
        const name = first_name
        if (!first_name || !city || !address || !mobile || !street) {
            return res.status(400).json({
                msg: 'These info are required:  first_name, city, address, mobile and street'
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

        // const usedEmail = await Client.findOne({ email })
        // if (usedEmail && (usedEmail.email !== client.email)) {
        //     return res.status(400).json({ msg: "This client email is already used." })
        // }

        const daftraResult = await editDaftraClient(staff_id, company, first_name, email, address, city, state, mobile, notes, category, birth_date, client.daftraClientId);
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
                name,
                company,
                city,
                address,
                street,
                mobile,
                email,
                notes,
                category,
                branches
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

/** Add user as a client to daftra */
exports.addUserAsClient = async (user) => {
    let { id: userId, name, location: city, address, mobile, email, daftraid } = user
    // !Note : company sometimes make an error using this random number
    const company = Math.floor(Math.random() * 10) // to be unique
    const state = "", notes = "", category = "", birth_date = "", street = "" // to neglect them
    city = 'Najran'

    const first_name = name
    let staff_id = 0;

    if (!companyName || !city || !address || !mobile) {
        return { result: 'fail', msg: 'These info are required:  first_name, city, address and mobile' }
    }
    if (user.daftraid) {
        staff_id = user.daftraid;
    }

    // const usedEmail = await Client.findOne({ email })
    // if (usedEmail) {
    //     return {
    //         result: 'fail',
    //         msg: "This client email is already used."
    //     }
    // }

    const daftraResult = await addDaftraClient(staff_id, company, first_name, email, address, city, state, mobile, notes, category, birth_date);
    if (daftraResult.result != "ok") {
        return {
            result: 'fail',
            msg: "error with daftra",
            err: daftraResult
        }
    }
    const imileResult = await addImileClient(company, name, city, address, mobile, email, notes);
    if (imileResult != 1) {
        await removeDaftraClient(daftraResult.id)
        return {
            result: 'fail',
            msg: "error with imile",
            err: imileResult
        }
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
    return { result: 'success', data: myClient }
}

exports.AddClientToMarkter = async (req, res) => {
    const clientId = req.body.clientId;
    const marketerCode = req.body.marketerCode;
    const client = await Client.findById(clientId);
    const marketer = await Markter.findOne({ "code": marketerCode });
    try {
        if (!marketer) {
            return res.status(400).json({
                msg: "markter code not found"
            })
        }
        client.marktercode = marketerCode;
        await client.save();
        return res.status(200).json({
            msg: "ok",
            data: client
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error
        })
    }
}
//************************************************************************************** */
const addDaftraClient = async (staff_id, company, first_name, email = "", address, city, state, mobile, notes, category, birth_date) => {
    let data = {
        Client: {
            "is_offline": true,
            "staff_id": staff_id,
            "business_name": company,
            "first_name": first_name,
            "last_name": "",
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

    console.log('******')
    console.log(response.data)
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

const editDaftraClient = async (staff_id, company, first_name, email = "", address, city, state, mobile, notes, category, birth_date, daftraClientId) => {
    let data = JSON.stringify({
        "Client": {
            "is_offline": true,
            "staff_id": staff_id,
            "business_name": company,
            "first_name": first_name,
            "last_name": " ",
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