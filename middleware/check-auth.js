const jwt = require("jsonwebtoken");
const JWT_KEY = "shhhhh";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[0];
    const decoded = jwt.verify(token, JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authorization Failed",
    });
  }
};
