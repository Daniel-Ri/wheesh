const { handleClientError } = require("../utils/handleError");

exports.authorize = (roles) => {
  return async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return handleClientError(res, 400, "Not authorized");
    }
  }
}