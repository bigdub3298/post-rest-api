const { verifyToken } = require("../util/authToken");

const User = require("../models/user");

module.exports = (req, _res, next) => {
  const token = getTokenFromRequest(req);

  const { userId } = verifyToken(token);

  User.findByPk(userId)
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

const getTokenFromRequest = req => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authorized");
    error.httpStatusCode = 401;
    throw error;
  }

  const [bearer, token] = authHeader.split(" ");
  return bearer === "Bearer" ? token : null;
};
