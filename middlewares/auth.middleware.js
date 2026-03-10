const jwt = require("jsonwebtoken");
const { User, RevokedToken } = require("../models");
const secretKey = process.env.SECRET_KEY;

async function authMiddleware(req, res, next) {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken || typeof accessToken !== "string") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }
  try {
    const revokedToken = await RevokedToken.findOne({
      where: { token: accessToken },
    });
    
    if (revokedToken) {
      return res.status(401).json({
        success: false,
        message: "Token revoked",
      });
    }

    const verifiedToken = jwt.verify(accessToken, secretKey);
    if (!verifiedToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request",
      });
    }
    const user = await User.findOne({
      where: { id: verifiedToken.id, email: verifiedToken.email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }
}

module.exports = authMiddleware;
