/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const uploadService = require('../api/services/upload.service');
const BrandController = require('../api/controllers/brands.controller');

app.put('/', validator.validateHeaders, uploadService.upload.single('brandLogo'), BrandController.register);
//app.put('/', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('brandLogo'), BrandController.register);
app.post('/:brand_id', validator.validateHeaders, uploadService.upload.single('brandLogo'), BrandController.update);
//app.post('/:brand_id', validator.validateHeaders, authorization.requiresLogin,uploadService.upload.single('brandLogo'), BrandController.update);
app.get('/', BrandController.all);
app.get('/:brand_id', validator.validateHeaders,  BrandController.view);
//app.get('/:brand_id', validator.validateHeaders, authorization.requiresLogin, BrandController.view);
app.delete('/:brand_id', validator.validateHeaders,BrandController.delete);
//app.delete('/:brand_id', validator.validateHeaders, authorization.requiresLogin, BrandController.delete);


module.exports = app;
