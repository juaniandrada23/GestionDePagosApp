const config = require('./config');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { auth } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const authRepo = require('./repositories/auth.repository');
const { inicializarBucket } = require('./services/storage.service');

const app = express();
app.set('port', config.port);
app.set('trust proxy', 1);

app.use(helmet());

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({ origin: config.corsOrigin, credentials: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intente nuevamente en 15 minutos.' },
});

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intente nuevamente en un momento.' },
});

app.get('/health', generalLimiter, (req, res) => res.json({ status: 'ok' }));
app.use('/login', authLimiter, require('./routes/login'));
app.use('/register', authLimiter, require('./routes/register'));

app.use(auth);
const setTenantContext = require('./middleware/tenantContext');
app.use(setTenantContext);
app.use(generalLimiter);
app.use('/proveedores', require('./routes/proveedores'));
app.use('/pagos', require('./routes/pagos'));
app.use('/calculos', require('./routes/calculos'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/mediodepago', require('./routes/mediodepago'));
app.use('/principal', require('./routes/principal'));
app.use('/materiales', require('./routes/materiales'));
app.use('/clientes', require('./routes/clientes'));
app.use('/presupuestos', require('./routes/presupuestos'));

app.use(errorHandler);

setInterval(
  () => {
    authRepo
      .limpiarExpirados()
      .catch((err) => console.error('Error limpiando tokens expirados:', err.message));
  },
  60 * 60 * 1000,
);

inicializarBucket()
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log('GestionDePagos corriendo en puerto', app.get('port'));
    });
  })
  .catch((err) => {
    console.error('Error inicializando MinIO:', err.message);
    process.exit(1);
  });
