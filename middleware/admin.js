const jwt = require("jsonwebtoken");
exports.isAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(400).json({
            msg: "token is requires"
        })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(400).json({
                msg: err
            })
        }
        if (user.user.roll == 'admin') {
            req.user = user.user
            next();
        } else {
            console.log(user.user.roll)
            res.status(304).json({
                msg: "not allowed"
            })
        }
    })
}