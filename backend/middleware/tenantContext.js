const { tenantContext } = require('../db/pool');

const setTenantContext = (req, res, next) => {
  if (req.user?.empresaId) {
    tenantContext.run({ empresaId: req.user.empresaId }, () => next());
  } else {
    next();
  }
};

module.exports = setTenantContext;
