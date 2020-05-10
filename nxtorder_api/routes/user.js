/** External modules **/
const express = require('express');
const app = express.Router();
//console.log("in routesssssssssss")
const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const userController = require('../api/controllers/user.controller');
const VendorController = require('../api/controllers/vendor.controller');
const uploadService = require('../api/services/upload.service');

app.get('/', validator.validateHeaders, authorization.requiresLogin, userController.all);
app.post('/:user_id', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('profilePicture'), userController.update);
app.get('/:user_id', validator.validateHeaders, authorization.requiresLogin, userController.view);
app.get('/:user_id/activate', authorization.requiresLogin, userController.activate);
//app.get('/:user_id/deactivate', authorization.requiresLogin, userController.deactivate);
app.get('/:user_id/logout', authorization.requiresLogin, userController.logout);
app.get('/:user_id/orders', validator.validateHeaders, authorization.requiresLogin, userController.myOrders);
app.get('/:user_id/stores', validator.validateHeaders, authorization.requiresLogin, userController.myStores);
app.put('/', validator.validateHeaders, uploadService.upload.single('profilePicture'), userController.register);

//R
app.get('/address/:user_id', validator.validateHeaders,authorization.requiresLogin,userController.address);
app.get('/:user_id/address/:address_id', validator.validateHeaders,authorization.requiresLogin,userController.getIndividualaddress);
app.post('/add-address/:user_id', validator.validateHeaders,authorization.requiresLogin,userController.addNewaddress);
//app.put('/user-add', validator.validateHeaders, uploadService.upload.single('profilePicture'), userController.register);
app.post('/del/users/:user_id', validator.validateHeaders,authorization.requiresLogin,userController.deleteAdd);

app.post('/:user_id/address/:address_id', validator.validateHeaders, authorization.requiresLogin, userController.updateAddressDetails);
app.get('/:user_id/qr_codes',validator.validateHeaders,authorization.requiresLogin, userController.getQRCode);
app.get('/:user_id/qr_code_verification',validator.validateHeaders,authorization.requiresLogin, userController.qrCodeVerification);
//app.get('/preffered-languages', userController.prefferedLanguages);
console.log("in usersss")
app.post('/review/:user_id', validator.validateHeaders,authorization.requiresLogin,userController.addReview);




//app.get('/', validator.validateHeaders, authorization.requiresLogin, userController.all);
//app.post('/:user_id', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('profilePicture'), userController.update);
//app.get('/:user_id', validator.validateHeaders, authorization.requiresLogin, userController.view);
//app.get('/:user_id/activate', authorization.requiresLogin, userController.activate);
////app.get('/:user_id/deactivate', authorization.requiresLogin, userController.deactivate);
//app.get('/:user_id/logout', authorization.requiresLogin, userController.logout);
//app.get('/:user_id/orders', validator.validateHeaders, authorization.requiresLogin, userController.myOrders);
//app.get('/:user_id/stores', validator.validateHeaders, authorization.requiresLogin, userController.myStores);
app.put('/vendor', validator.validateHeaders, userController.register);

module.exports = app;
