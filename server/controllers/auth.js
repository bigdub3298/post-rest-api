const bcrypt = require("bcrypt");

const User = require("../models/user");
const { signToken } = require("../util/authToken");
const { testForValidationErrors } = require("../util/validationError");

exports.signUp = (req, res, next) => {
  testForValidationErrors(req);

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
  testForValidationErrors(req);

  const { password } = req.body;

  bcrypt
    .compare(password, req.user.password)
    .then(doMatch => {
      if (!doMatch) {
        const error = new Error("Invalid email or password.");
        error.httpStatusCode = 401;
        throw error;
      }

      const token = signToken(
        { email: req.user.email, userId: req.user.id },
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
