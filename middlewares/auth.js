const jwt = require("jsonwebtoken");
const AuthorizationError = require("../errors/authorization-err");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const error = new AuthorizationError("Необходима авторизация");
    next(error);
    return;
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : "secret-key");
  } catch (err) {
    const error = new AuthorizationError("Необходима авторизация");
    next(error);
  }

  req.user = payload;

  next();
};
