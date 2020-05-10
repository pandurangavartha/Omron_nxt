/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const permissionController = require('../api/controllers/permission.controller');

app.get('/', validator.validateHeaders, authorization.requiresLogin, permissionController.all);
// app.get('/:permission_id', validator.validateHeaders, authorization.requiresLogin, permissionController.view);
// app.post('/:permission_id', validator.validateHeaders, authorization.requiresLogin, permissionController.update);
// app.delete('/:permission_id', validator.validateHeaders, authorization.requiresLogin, permissionController.delete);
// app.put('/', validator.validateHeaders, authorization.requiresLogin, permissionController.register);

module.exports = app;
