const Clint = require("../model/clint");

exports.addNewClint = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const city = req.body.city;
        const address = req.body.address;
        const user = req.user.user.id;
        const newClint = new Clint({
            name: name,
            email: email,
            mobile: mobile,
            city: city,
            address: address,
            user: user
        })
        await newClint.save();
        res.status(200).json({
            msg: "ok",
            data: newClint
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
exports.adddeposit = (req, res) => {
    const deposit = req.body.deposit;
    const receipt = req.file;
    const cId = req.body.clintid;
    Clint.findById(cId)
        .then(c => {
            c.wallet = c.wallet + deposit;
            c.receipts.push(receipt.path);
            c.save()
                .then(c => {
                    res.status(200).json({
                        msg: "ok",
                        data: c
                    })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}
exports.getAllMarkterClint = (req, res) => {
    const mId = req.user.user.id;
    Clint.find({ user: mId })
        .then(c => {
            res.status(200).json({
                data: c
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}