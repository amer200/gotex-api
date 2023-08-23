const axios = require('axios');
const User = require("../../model/user");
const { json } = require('body-parser');
exports.getAllStaff = (req, res) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://aljwadalmomez.daftra.com/api2/staff',
        headers: {
            'APIKEY': process.env.daftra_Key
        }
    };

    axios.request(config)
        .then((response) => {
            res.status(200).json({
                data: response.data
            })
        })
        .catch((error) => {
            console.log(error);
        });

}
exports.getStaffById = (req, res) => {
    const id = req.params.id;
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://aljwadalmomez.daftra.com/api2/staff/${id}`,
        headers: {
            'APIKEY': process.env.daftra_Key
        }
    };

    axios.request(config)
        .then((response) => {
            res.status(200).json({
                data: response.data
            })
        })
        .catch((error) => {
            console.log(error);
        });

}
exports.connectMarkterWithDaftra = async (req, res) => {
    try {
        const daftraId = req.body.daftraid;
        const marketerId = req.body.marketerid;
        const marketer = await User.findById(marketerId);
        if (!marketer) {
            return res.status(404).json({
                msg: "markter not found"
            })
        }
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://aljwadalmomez.daftra.com/api2/staff/${daftraId}`,
            headers: {
                'APIKEY': process.env.daftra_Key
            }
        };
        const daftraUser = await axios.request(config);
        if (daftraUser.status == 200) {
            marketer.daftraid = daftraUser.data.data.Staff.id
            await marketer.save();
            res.status(200).json({
                msg: "ok"
            })
        }
    } catch (err) {
        console.log(err)
    }
    // console.log(marketer);
    // .then(async u => {
    //     if (!u) {
    //         res.status(400).json({
    //             msg: "error markter not found"
    //         })
    //     }
    //     const daftraUser = await axios.request(config);
    //     console.log(daftraUser)
    // })
}