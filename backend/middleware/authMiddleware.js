const jwt = require("jsonwebtoken");
const verifyToken = ( req, res, next) => {
    try{
        // Get token
        const authHeader =
        req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                message: "No token provided"
            });
        }
        // Bearer xxxxx
        const token =
        authHeader.split(" ")[1];
        // Verify
        const decoded =
        jwt.verify(
            token,
            process.env.JWT_SECRET
        );
     // Save user
     req.user = decoded;
     next();

    } catch (err){
        res.status(401).json({
            message: " Invalid token"
        });
    }

};
module.exports = verifyToken;