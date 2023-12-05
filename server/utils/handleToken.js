const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.signToken = (id, role) => {
  // Expire in 1 day
  return jwt.sign({ exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, id, role }, JWT_SECRET);
}

exports.validateToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

exports.generateRandomToken = () => {
  const token = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
  return token;
}

exports.signResetToken = (id) => {
  // Expire in 1 hour
  return jwt.sign({ exp: Math.floor(Date.now() / 1000) + 60 * 60, id }, JWT_SECRET);
}