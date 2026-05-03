const adminMiddleware = (req, res, next) => {

    try {

        if (req.role === "admin") {
            next()
        } else {
            res.status(403).json("Access denied. Admin only.")
        }

    } catch (error) {
        res.status(401).json("Authorization failed")
    }
}

module.exports = adminMiddleware