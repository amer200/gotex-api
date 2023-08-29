const axios = require('axios');
const User = require("../../model/user");
const CreditOrder = require("../../model/clientscreaditorders");

exports.getAllClints = async (req, res) => {
    let allClients = [];
    const result = await getAllClientsPage(1);
    allClients.push(...result.clients);
    var pageCount = result.pageCount;
    var myPage = result.myPage;
    for (myPage = 2; myPage <= pageCount; myPage++) {
        let secResult = await getAllClientsPage(myPage);
        console.log(secResult)
        allClients.push(...secResult.clients);
    }
    res.status(200).json({
        data: allClients
    })
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
exports.getClintsByMartker = async (req, res) => {
    const marketerId = req.user.user.daftraid;
    const myClients = await getMarkterClient(marketerId);
    res.status(200).json({
        data: myClients
    })
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
    const cId = req.body.client_id;
    //*************************** */
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
        method: 'put',
        maxBodyLength: Infinity,
        url: `https://aljwadalmomez.daftra.com/api2/clients/${cId}`,
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
exports.addCreaditByMarkter = async (req, res) => {
    try {
        const marketerId = req.user.user.id;
        const client_id = req.body.client_id;
        const credit_limit = req.body.credit_limit;
        const credit_period = (4 - new Date().getDay());
        const o = new CreditOrder({
            markterid: marketerId,
            clientid: client_id,
            credit_period: credit_period,
            credit_limit: credit_limit,
            status: false
        })
        await o.save();
        res.status(200).json({
            msg: "ok , wait for admin approve"
        })
    } catch (error) {
        console.log(error)
    }
}
exports.getAllCreditOrder = (req, res) => {
    CreditOrder.find()
        .populate("markterid")
        .then(c => {
            res.status(200).json({
                msg: c
            })
        })
        .catch(err => {
            console.log(err)
        })
}
exports.ChangeCreditOrderStatus = async (req, res) => {
    const orderId = req.body.orderid;
    const status = req.body.status;
    const o = await CreditOrder.findById(orderId);
    if (status == 1) {
        o.status = true;
        let data = JSON.stringify({
            "Client": {
                "credit_limit": o.credit_limit,
                "credit_period": o.credit_period
            }
        });

        let config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `https://aljwadalmomez.daftra.com/api2/clients/${o.clientid}`,
            headers: {
                'APIKEY': process.env.daftra_Key,
                'Content-Type': 'application/json',
            },
            data: data
        };
        const response = await axios(config)
        res.status(200).json({
            msg: "ok accepted request",
            data: response.data
        })
    } else {
        const removeO = await CreditOrder.findByIdAndRemove(orderId)
        res.status(200).json({
            msg: "ok removed",
            data: removeO
        })
    }
}
//******************************************** */
const getAllClientsPage = async (page) => {
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
const getMarkterClient = async (markterId) => {
    const all = await allClients();
    const result = all.filter(c => {
        return c.Client.staff_id == markterId;
    })
    return result
}
const allClients = async () => {
    let allClients = [];
    const result = await getAllClientsPage(1);
    allClients.push(...result.clients);
    var pageCount = result.pageCount;
    var myPage = result.myPage;
    for (myPage = 2; myPage <= pageCount; myPage++) {
        let secResult = await getAllClientsPage(myPage);
        console.log(secResult)
        allClients.push(...secResult.clients);
    }
    return allClients
}