const { handleClientError, handleServerError } = require('../utils/handleError');
const { validateToken } = require('../utils/handleToken');
const { User } = require("../models");

const authentication = async(req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      return handleClientError(res, 401, 'Authentication failed, you need token');
    }
    const token = bearerToken.replace('Bearer ', '');

    const decodedToken = validateToken(token);
    if (!decodedToken) {
      return handleClientError(res, 400, 'Token is invalid')
    }
    const { id, role } = decodedToken;

    const foundUser = await User.findOne(
      { where: {id, role}}
    );
    if (!foundUser) {
      return handleClientError(res, 400, "Token is invalid");
    }

    console.log(foundUser, '<< FOUND USER');

    req.user = { id, role };

    next();
  } catch (error) {
    console.log(error)
    handleServerError(res)
  }
};

module.exports = authentication;
