module.exports = (error, _req, res, _next) => {
  console.log(error);
  const status = error.httpStatusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
};
