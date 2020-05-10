/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const productInventoryController = require('../api/controllers/product-inventory.controller');

app.get('/store/:store_id', validator.validateHeaders, authorization.requiresLogin, productInventoryController.all);
app.get('/:inventory_id', validator.validateHeaders, authorization.requiresLogin, productInventoryController.view);
app.post('/:inventory_id', validator.validateHeaders, authorization.requiresLogin, productInventoryController.update);
app.delete('/:inventory_id', validator.validateHeaders, authorization.requiresLogin, productInventoryController.delete);
app.put('/', validator.validateHeaders, authorization.requiresLogin, productInventoryController.register);

module.exports = app;
