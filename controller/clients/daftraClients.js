const axios = require("axios");

exports.addDaftraClient = async (staff_id, company, first_name, address, city, state, mobile, notes, category, birth_date) => {
    let data = {
        Client: {
            "is_offline": true,
            "staff_id": staff_id,
            "business_name": company,
            "first_name": first_name,
            "last_name": "",
            "email": "",
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
exports.removeDaftraClient = async (id) => {
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
exports.editDaftraClient = async (staff_id, company, first_name, address, city, state, mobile, notes, category, birth_date, daftraClientId) => {
    let data = JSON.stringify({
        "Client": {
            "is_offline": true,
            "staff_id": staff_id,
            "business_name": company,
            "first_name": first_name,
            "last_name": " ",
            "email": "",
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
exports.getAllDaftraClientsPage = async (page) => {
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