/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const callsController = require('../api/controllers/calls.controller');

app.get('/all/:user_id', validator.validateHeaders, authorization.requiresLogin, callsController.getAllCalls);
app.put('/', validator.validateHeaders, authorization.requiresLogin, callsController.register);
app.get('/:id', validator.validateHeaders, authorization.requiresLogin, callsController.view);

module.exports = app;
