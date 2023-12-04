exports.handleServerError = (res) => {
  return res.status(500).json({ message: 'Internal server error' });
};
  
exports.handleClientError = (res, status, message) => {
  return res.status(status).json({ message });
};