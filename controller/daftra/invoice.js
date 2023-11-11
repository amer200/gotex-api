const axios = require('axios');
const User = require("../../model/user");
exports.getAll = async (req, res) => {
    const data = await getAllInovice();
    res.status(200).json({
        data: data
    })
}
exports.getMarkterInovices = async (req, res) => {
    try {
        const marketerId = req.user.user.id;
        const marketer = await User.findById(marketerId);
        const staffId = marketer.daftraid;
        if (!staffId) {
            return res.status(404).json({
                msg: "staff if not found may your account doesn't connect please call your admin"
            })
        }
        const invs = await getAllInovice();
        const myInvs = invs.filter(i => {
            return i.staff_id == staffId
        })
        res.status(200).json({
            data: myInvs
        })
    } catch (error) {
        console.log(error)
    }

}

exports.getInvoiceById = async (req, res) => {
    const invoiceId = req.params.id
    const marketerId = req.user.user.id;

    try {
        const marketer = await User.findById(marketerId);
        const staffId = marketer.daftraid;
        if (!staffId) {
            return res.status(404).json({
                msg: "staff if not found may your account doesn't connect please call your admin"
            })
        }

        const config = {
            method: 'get',
            url: `https://aljwadalmomez.daftra.com/api2/invoices/${invoiceId}.json`,
            headers: {
                'APIKEY': process.env.daftra_Key
            }
        }
        const response = await axios(config)
        if (response.data.code != '200') {
            res.status(400).json({ msg: response.data })
        }

        // res.status(200).json({ data: response.data.data.Invoice.invoice_html_url })
        res.status(200).json({ data: response.data.data })
    } catch (error) {
        console.log(error)
    }

}
//********************************************** */
const getInoviceByPage = async (page) => { //page start from 1
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://aljwadalmomez.daftra.com/api2/invoices?page=${page}`,
        headers: {
            'APIKEY': process.env.daftra_Key
        }
    }
    const response = await axios(config);
    const result = {
        data: response.data.data,
        pagination: response.data.pagination
    }
    return result
}
const getAllInovice = async () => {
    let invs = [];
    const page1Data = await getInoviceByPage(1);
    invs.push(...page1Data.data);
    if (page1Data.pagination.page < page1Data.pagination.page_count) {
        var counter = 2;
        while (counter <= page1Data.pagination.page_count) {
            const myData = await getInoviceByPage(counter);
            invs.push(...myData.data)
            counter++
        }
    }
    return invs
}