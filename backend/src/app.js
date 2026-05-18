const { loadBackendEnv } = require('./config/loadEnv');
loadBackendEnv();

const express = require('express');
const cors = require('cors');
const session = require('express-session');

const apiRoutes = require('./routes');
const { createCorsOptions } = require('./config/cors');
const sessionConfig = require('./config/session');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);

app.use(cors(createCorsOptions()));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionConfig));

app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
