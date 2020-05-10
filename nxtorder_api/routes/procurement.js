/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const procurementController = require('../api/controllers/procurement.controller');

app.get('/all', validator.validateHeaders, authorization.requiresLogin, procurementController.all);
app.get('/:id', validator.validateHeaders, authorization.requiresLogin, procurementController.view);
app.post('/:id', validator.validateHeaders, authorization.requiresLogin, procurementController.update);
app.delete('/:id', validator.validateHeaders, authorization.requiresLogin, procurementController.delete);
app.put('/', validator.validateHeaders, authorization.requiresLogin, procurementController.register);

module.exports = app;
