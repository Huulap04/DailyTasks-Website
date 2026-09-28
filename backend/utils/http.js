function sendError(res, status, code, message) {
  return res.status(status).json({
    message,
    error: { code, message },
  });
}

module.exports = { sendError };
