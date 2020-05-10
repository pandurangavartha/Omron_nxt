/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const roleController = require('../api/controllers/role.controller');

app.get('/', validator.validateHeaders, authorization.requiresLogin, roleController.getAll);
app.get('/:role_id', validator.validateHeaders, authorization.requiresLogin, roleController.view);
app.post('/:role_id/addpermissions', validator.validateHeaders, authorization.requiresLogin, roleController.addPermissions);
app.post('/:role_id/removepermissions', validator.validateHeaders, authorization.requiresLogin, roleController.removePermissions);
app.post('/:role_id', validator.validateHeaders, authorization.requiresLogin, roleController.update);
app.delete('/:role_id', validator.validateHeaders, authorization.requiresLogin, roleController.delete);
app.put('/', validator.validateHeaders, authorization.requiresLogin, roleController.register);

module.exports = app;
