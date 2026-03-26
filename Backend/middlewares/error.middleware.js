module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  const code = err.code || (status >= 500 ? 'SERVER_ERROR' : 'REQUEST_ERROR');
  const details = err.details || undefined;

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(status).json({
    error: {
      message,
      code,
      details,
    },
  });
};
