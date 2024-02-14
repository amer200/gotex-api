const jwt = require("jsonwebtoken");

exports.isMarketerOrAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(400).json({
                msg: err
            })
        }

        if (user.data.user.rolle == 'marketer' || user.data.user.rolle == 'admin') {
            req.user = user.data
            next();
        } else {
            res.status(405).json({
                msg: "not allowed"
            })
        }
    })
}