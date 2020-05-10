/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const paymentController = require('../api/controllers/payment.controller');

app.get('/', validator.validateHeaders, authorization.requiresLogin, paymentController.all);
app.get('/:payment_id', validator.validateHeaders, authorization.requiresLogin, paymentController.view);
app.post('/:payment_id', validator.validateHeaders, authorization.requiresLogin, paymentController.update);
app.delete('/:payment_id', validator.validateHeaders, authorization.requiresLogin, paymentController.delete);
app.put('/', validator.validateHeaders, authorization.requiresLogin, paymentController.register);

module.exports = app;
