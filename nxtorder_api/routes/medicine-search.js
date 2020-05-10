/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const uploadService = require('../api/services/upload.service');

const ms = require('../api/controllers/medicine-search');

app.get('/search/:searchString', ms.search);

module.exports = app;