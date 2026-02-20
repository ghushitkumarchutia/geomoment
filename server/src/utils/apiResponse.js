const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

const error = (res, message, statusCode = 500, errors = []) => {
  const response = { success: false, message };
  if (errors.length) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

module.exports = { success, error };
