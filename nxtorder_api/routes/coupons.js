/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const uploadService = require('../api/services/upload.service');

const couponController = require('../api/controllers/coupon.controller');

app.post('/', validator.validateHeaders,uploadService.upload.single('logo'), couponController.register);
//app.post('/', validator.validateHeaders, authorization.requiresLogin,  couponController.register);
//app.post('/', couponController.register);
//app.post('/:industry_id', validator.validateHeaders, authorization.requiresLogin,uploadService.upload.single('banner'), industryController.update);
app.post('/:coupon_id', uploadService.upload.single('logo'), couponController.update);
//app.get('/', validator.validateHeaders, authorization.requiresLogin, industryController.all);
app.get('/', couponController.all);
//app.get('/:industry_id', validator.validateHeaders, authorization.requiresLogin, industryController.view);
//app.delete('/:industry_id', validator.validateHeaders, authorization.requiresLogin, industryController.delete);


module.exports = app;
