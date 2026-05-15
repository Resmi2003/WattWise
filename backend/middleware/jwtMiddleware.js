const jwt = require('jsonwebtoken')

const jwtMiddleware = (req, res, next) => {
    console.log("inside jwt middleware");

    try {

        const authHeader = req.headers["authorization"]   // gets token from request header

        if (!authHeader) {
            return res.status(401).json("Authorization header missing")
        }

        const token = authHeader.split(" ")[1]   // removes bearer 

        if (!token) {
            return res.status(401).json("Token missing")
        }

        const jwtResponse = jwt.verify(token, process.env.JWT_SECRET)

        req.payload = jwtResponse.userId
        req.role = jwtResponse.role

        next()

    } catch (err) {

        if (err.name === "TokenExpiredError") {
            return res.status(401).json("Token expired, please login again")
        }

        res.status(401).json("Authorization failed")
    }
}

module.exports = jwtMiddleware