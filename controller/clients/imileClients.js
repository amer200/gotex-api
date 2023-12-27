const Imile = require("../../model/imile");
const axios = require("axios");

exports.addImileClient = async (company, name, city, address, mobile, notes) => {
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
            "email": "",
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

exports.editImileClient = async (obj) => {
    const { company, name, city, address, mobile, notes } = obj
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
            "email": "",
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
        return response.data
    }

    return 1
}