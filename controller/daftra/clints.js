const axios = require('axios');
const User = require("../../model/user");

exports.getAllClints = (req, res) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://aljwadalmomez.daftra.com/api2/clients',
        headers: {
            'APIKEY': process.env.daftra_Key
        }
    }
    axios.request(config)
        .then((response) => {
            res.status(200).json({
                data: response.data
            })
        })
        .catch((error) => {
            console.log(error.data);
        });
}
exports.getClintById = (req, res) => {
    const clintId = req.params.cId;
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://aljwadalmomez.daftra.com/api2/clients/${clintId}`,
        headers: {
            'APIKEY': process.env.daftra_Key
        }
    }
    axios.request(config)
        .then((response) => {
            res.status(200).json({
                data: response.data
            })
        })
        .catch((error) => {
            console.log(error.response.data);
            res.status(400).json({
                msg: error.response.data
            })
        });
}
exports.getClintsByMartker = (req, res) => {
    const daftraId = req.user.user.daftraid;
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://aljwadalmomez.daftra.com/api2/clients',
        headers: {
            'APIKEY': process.env.daftra_Key
        }
    }
    axios.request(config)
        .then((response) => {
            const allClients = response.data.data;
            const marketerClients = allClients.filter(c => {
                return c.Client.staff_id = daftraId
            })
            res.status(200).json({
                data: marketerClients
            })
        })
        .catch((error) => {
            console.log(error.response.data);
        });
}
exports.addNewClient = (req, res) => {
    const marketerId = req.user.user.daftraid;
    const business_name = req.body.business_name;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const address = req.body.address1;
    const city = req.body.city;
    const state = req.body.state;
    const phone = req.body.phone;
    const notes = req.body.notes;
    const category = req.body.category;
    const birth_date = req.body.birth_date;
    let data = JSON.stringify({
        "Client": {
            "is_offline": true,
            "staff_id": marketerId,
            "business_name": business_name,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "address1": address,
            "city": city,
            "state": state,
            "phone1": phone,
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
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://aljwadalmomez.daftra.com/api2/clients',
        headers: {
            'APIKEY': process.env.daftra_Key,
            'Content-Type': 'application/json',
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            res.status(200).json({
                data: response.data
            })
        })
        .catch((error) => {
            console.log(error.response.data);
            res.status(400).json({
                err: error.response.data
            })
        });
}
exports.editClientInfo = async (req, res) => {
    const marketerId = req.user.user.daftraid;
    const business_name = req.body.business_name;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const address = req.body.address1;
    const city = req.body.city;
    const state = req.body.state;
    const phone = req.body.phone;
    const notes = req.body.notes;
    const category = req.body.category;
    const birth_date = req.body.birth_date;
    //******************************* */
    // let config = {
    //     method: 'get',
    //     maxBodyLength: Infinity,
    //     url: 'https://aljwadalmomez.daftra.com/api2/clients/',
    //     headers: {
    //         'APIKEY': process.env.daftra_Key
    //     }
    // }
    // axios.request(config)

    // const client = await axios(config);
    // console.log(client)
    console.log(marketerId)
    getMarkterClient(marketerId)
}
//******************************************** */
const getMarkterClient = async (markterId) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://aljwadalmomez.daftra.com/api2/clients?page=2',
        headers: {
            'APIKEY': process.env.daftra_Key
        }
    }
    const allClients = await axios.request(config);
    const myClients = [];
    // const myClients = await allClients.data.data.filter(c => c.Client.staff_id == markterId)
    allClients.data.data.forEach(c => {
        if (c.Client.staff_id == "2") {
            myClients.push(c)
        }
    });
    console.log(myClients)
}