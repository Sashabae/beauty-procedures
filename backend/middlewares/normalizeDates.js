function normalizeDates(req, res, next) {
  if (req.body.dates && !Array.isArray(req.body.dates)) {
    req.body.dates = [req.body.dates];
  }
  next();
}

module.exports = normalizeDates;