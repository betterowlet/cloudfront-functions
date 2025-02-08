const serverless = require('serverless-http');
const app = require('../../src/index.js');

exports.handler = serverless(app);