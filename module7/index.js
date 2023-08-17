
const express = require("express");
const serverless = require("serverless-http");
const cors = require('cors')
const app = express();
require('./helpers/env.helper')
app.use(cors())
app.use(express.json());
app.use(require('./config/routes'))

module.exports.handler = serverless(app);
