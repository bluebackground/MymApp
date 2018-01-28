const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');

const server = express();
server.use(bodyParser.json());
server.use(cors());
routes(server);

module.exports = server;
