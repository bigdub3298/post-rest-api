require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
        name
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

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.data = errors.array();
    throw error;
  }

  const { password } = req.body;

  bcrypt
    .compare(password, req.user.password)
    .then(doMatch => {
      if (!doMatch) {
        const error = new Error("Invalid email or password.");
        error.httpStatusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        { email: req.user.email, userId: req.user.id },
        process.env.SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login user successful.",
        token,
        userId: req.user.id
      });
    })
    .catch(err => {
      if (!err.httpStatusCode) err.httpStatusCode = 500;
      next(err);
    });
};
