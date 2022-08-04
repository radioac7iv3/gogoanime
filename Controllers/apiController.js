/* eslint-disable prettier/prettier */
exports.home = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ok',
  });
};
