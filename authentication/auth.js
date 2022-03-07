const jwt = require("jsonwebtoken")
require("dotenv").config();
const secretKey = process.env.key
module.exports = {
    verifyUserToken: (req, res, next) => {
        const tokens = req.params.token
        if (!tokens) {
            res.status(400).json({
                message: "token not found",
                status: 400,
                success: false
            })
        }
        else {
            const x = jwt.verify(tokens, secretKey, (err, decoded) => {
                if (decoded) {
                    next()
                } else {
                    res.status(401).json({
                        message: "invalid token",
                        status: 401,
                        success: false
                    })
                }
            })
        }
    }
}
