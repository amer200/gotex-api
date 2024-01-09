const User = require("../model/user");
const jwt = require("jsonwebtoken");

exports.isVerifiedCodeToken = (req, res, next) => {
    const { token } = req.body

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decodedData) => {
            if (err) {
                return res.status(404).json({
                    msg: "Incorrect token or may be it is expired"
                })
            }

            const user = await User.findOne({ email: decodedData.email });
            if (!user) {
                return res.status(404).json({
                    msg: "user email not found"
                })
            }

            req.user = user
            next();
        });
    } catch (err) {
        console.log(`user erro : ${err}`)
    }
}