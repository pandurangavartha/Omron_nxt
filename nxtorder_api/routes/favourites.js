/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const favouritesController = require('../api/controllers/favourites.controller');

//app.get('/all', validator.validateHeaders, authorization.requiresLogin, cartController.all);
app.get('/all/:user_id', validator.validateHeaders, authorization.requiresLogin, favouritesController.favouritesAllItems);
//app.get('/:id', validator.validateHeaders, authorization.requiresLogin, cartController.view);
//app.post('/:id', validator.validateHeaders, authorization.requiresLogin, cartController.update);
app.delete('/:favourites_id', validator.validateHeaders, authorization.requiresLogin, favouritesController.delete);
app.delete('/delete/:product_id', validator.validateHeaders, authorization.requiresLogin, favouritesController.unFavourite);
app.put('/', validator.validateHeaders, authorization.requiresLogin, favouritesController.register);

module.exports = app;
