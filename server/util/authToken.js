require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.signToken = (payload, options = {}) => {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

exports.verifyToken = token => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload) {
      return payload;
    } else {
      const error = new Error("Not authorized.");
      error.httpStatusCode = 401;
      throw error;
    }
  } catch (err) {
    throw err;
  }
};
