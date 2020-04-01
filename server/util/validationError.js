const { validationResult } = require("express-validator");

exports.testForValidationErrors = req => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.data = errors.array();
    error.httpStatusCode = 422;
    throw error;
  }
};

exports.testForFileError = req => {
  if (!req.file) {
    const error = new Error("No image provided.");
    error.httpStatusCode = 422;
    throw error;
  }
};
