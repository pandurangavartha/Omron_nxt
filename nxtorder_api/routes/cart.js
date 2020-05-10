/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const cartController = require('../api/controllers/cart.controller');

app.get('/all', validator.validateHeaders, authorization.requiresLogin, cartController.all);
app.get('/all/:user_id', validator.validateHeaders, authorization.requiresLogin, cartController.cartAllItems);
app.get('/:id', validator.validateHeaders, authorization.requiresLogin, cartController.view);
app.post('/:id', validator.validateHeaders, authorization.requiresLogin, cartController.update);
app.delete('/:id', validator.validateHeaders, authorization.requiresLogin, cartController.delete);
app.put('/', validator.validateHeaders,  cartController.register);

module.exports = app;
