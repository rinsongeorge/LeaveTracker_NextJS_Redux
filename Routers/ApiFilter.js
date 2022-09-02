const jwt = require('jsonwebtoken');
const jwtSecret = "leavetrackerjwtsupersecret";

exports.middleware = (async (req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("cache-control", "no-cache");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.path == '/login') {
        console.log('path -> ' + req.path);
        return next();
    }
    const jwtToken = req.cookies['jwtToken'];
    try {
        var decoded = jwt.verify(jwtToken, jwtSecret);
        console.log("decoded", decoded)
    } catch (err) {
        res.clearCookie('jwtToken');
        return res.status(401).json({ "msg": req.path + " --> " + err.message })
    }
    next();
});
