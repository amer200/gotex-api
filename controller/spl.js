const Spl = require("../model/spl");
const axios = require("axios");
const { response } = require("express");
const qs = require("qs");
exports.getToken = (req, res) => {
    const grant_type = "password";
    const UserName = "ExtrCarriyo";
    const Password = "P@ssw0rd#2o2!";
    var data = qs.stringify({
        'grant_type': 'password',
        'UserName': 'ExtrCarriyo',
        'Password': process.env.spl_password
    });
    var config = {
        method: 'post',
        url: 'https://gateway-minasapre.sp.com.sa/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios(config)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err)
        })
}