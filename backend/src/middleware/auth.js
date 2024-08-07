const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Assuming the token is stored in a cookie named 'authToken'
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send({ message: "Invalid token." });
  }
};

module.exports = auth;
