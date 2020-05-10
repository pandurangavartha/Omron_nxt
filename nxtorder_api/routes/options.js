/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const uploadService = require('../api/services/upload.service');
const OptionTypeController = require('../api/controllers/option-type.controller');
//const industryController = require('../api/controllers/option-val.controller');

app.post('/type', validator.validateHeaders, OptionTypeController.typeAdd);

app.post('/value', validator.validateHeaders, OptionTypeController.valueAdd);
//app.post('/', validator.validateHeaders, authorization.requiresLogin, OptionTypeController.register);
app.post('/:industry_id', validator.validateHeaders, authorization.requiresLogin,uploadService.bulkupload.array('banner'), OptionTypeController.update);
//app.get('/', validator.validateHeaders, authorization.requiresLogin, industryController.all);
app.get('/values/:type_id', OptionTypeController.valuesAll);
app.get('/:industry_id', validator.validateHeaders, authorization.requiresLogin, OptionTypeController.view);
app.delete('/:industry_id', validator.validateHeaders, authorization.requiresLogin, OptionTypeController.delete);


//// offers management
//
////app.get('/:store_id/products/offers', offerController.products);
//app.get('/products/offers', offerController.products);
//app.get('/:store_id/products/:product_id/offers',  offerController.all);
////app.get('/:store_id/offers', validator.validateHeaders, authorization.requiresLogin, offerController.all);
//app.get('/:store_id/products/:product_id/offers/:offer_id', validator.validateHeaders, authorization.requiresLogin, offerController.view);
//app.post('/:store_id/products/:product_id/offers/:offer_id', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('bannerImage'), offerController.update);
//app.delete('/:store_id/products/:product_id/offers/:offer_id', validator.validateHeaders, authorization.requiresLogin, offerController.delete);
//app.put('/:industry_id/stores/:store_id/products/:product_id/offers', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('bannerImage'), offerController.register);


module.exports = app;
