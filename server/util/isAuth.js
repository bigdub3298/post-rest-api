require("dotenv").config();

const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authorized");
    error.httpStatusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch (err) {
    err.httpStatusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Not authorized");
    error.httpStatusCode = 401;
    throw error;
  }

  User.findByPk(decodedToken.userId)
    .then(user => {
      if (!user) {
        const error = new Error("Invlaid user");
        error.httpStatusCode = 401;
        throw error;
      }
      req.user = user;
      next();
    })
    .catch(err => {
      if (!err.httpStatusCode) err.httpStatusCode = 500;
      next(err);
    });
};
