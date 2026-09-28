const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/http");
const verifyToken = ( req, res, next) => {
    try{
        // Get token
        const authHeader =
        req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return sendError(res, 401, "MISSING_TOKEN", "Bạn cần đăng nhập để tiếp tục.");
        }
        // Bearer xxxxx
        const token = authHeader.slice("Bearer ".length).trim();
        if (!token) {
            return sendError(res, 401, "MISSING_TOKEN", "Bạn cần đăng nhập để tiếp tục.");
        }
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
        return sendError(res, 401, "INVALID_TOKEN", "Phiên đăng nhập đã hết hạn hoặc không hợp lệ.");
    }

};
module.exports = verifyToken;
