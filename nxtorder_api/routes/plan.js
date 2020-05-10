/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const planController = require('../api/controllers/plan.controller');

//app.get('/', validator.validateHeaders, authorization.requiresLogin, planController.getAll);
app.get('/', validator.validateHeaders, planController.getAll);
app.get('/:plan_id', validator.validateHeaders, authorization.requiresLogin, planController.view);
app.post('/:plan_id', validator.validateHeaders, authorization.requiresLogin, planController.update);
app.delete('/:plan_id', validator.validateHeaders, authorization.requiresLogin, planController.delete);
app.put('/', validator.validateHeaders, planController.register);
//app.put('/', validator.validateHeaders, authorization.requiresLogin, planController.register);
app.put('/status-change', validator.validateHeaders, authorization.requiresLogin, planController.planActivate);

module.exports = app;
