const { ValidationError } = require('../errors/AppError');

const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const { error, value } = schema(req[source]);
    if (error) {
      throw new ValidationError(error);
    }
    req[source] = value;
    next();
  };

module.exports = validate;
