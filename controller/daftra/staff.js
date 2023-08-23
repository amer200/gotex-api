const axios = require('axios');
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