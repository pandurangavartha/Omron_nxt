/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const favouriteStoresController = require('../api/controllers/favourite-stores.controller');

//app.get('/all/:user_id', validator.validateHeaders, authorization.requiresLogin, favouriteStoresController.favouriteStoresAllItems);
app.get('/all/:user_id', validator.validateHeaders,  favouriteStoresController.favouriteStoresAllItems);
app.delete('/:favourite-store_id', validator.validateHeaders, authorization.requiresLogin, favouriteStoresController.delete);
app.delete('/delete/:store_id', validator.validateHeaders, authorization.requiresLogin, favouriteStoresController.unfavStores);
app.put('/', validator.validateHeaders, authorization.requiresLogin, favouriteStoresController.register);

module.exports = app;
