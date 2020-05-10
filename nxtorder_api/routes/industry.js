/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const uploadService = require('../api/services/upload.service');
const offerController = require('../api/controllers/offer.controller');
const industryController = require('../api/controllers/industry.controller');
console.log("in indutsry conrollll")
app.post('/', validator.validateHeaders, authorization.requiresLogin, uploadService.bulkupload.array('banner'), industryController.register);
app.post('/:industry_id', validator.validateHeaders, authorization.requiresLogin,uploadService.bulkupload.array('banner'), industryController.update);
//app.get('/', validator.validateHeaders, authorization.requiresLogin, industryController.all);
app.get('/', industryController.all);
app.get('/:industry_id', validator.validateHeaders, authorization.requiresLogin, industryController.view);
app.delete('/:industry_id', validator.validateHeaders, authorization.requiresLogin, industryController.delete);


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
