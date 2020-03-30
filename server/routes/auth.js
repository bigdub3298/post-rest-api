const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then(user => {
          if (user) {
            return Promise.reject("This email is already registered.");
          }
        });
      }),
    body("password", "Password must be at least 8 characters.")
      .trim()
      .isLength({ min: 8 }),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords must match.");
        }
        return true;
      }),
    body("name")
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signUp
);

module.exports = router;
