const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.data = errors.array();
    error.httpStatusCode = 422;
    throw error;
  }

  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      return User.create({
        email,
        password: hashedPassword,
        name,
        status: "something"
      });
    })
    .then(user => {
      if (!user) {
        throw new Error("Create user failed.");
      }
      res
        .status(201)
        .json({ message: "Create user successful.", userId: user.id });
    })
    .catch(err => {
      if (!err.httpStatusCode) err.httpStatusCode = 500;
      next(error);
    });
};
