/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const expenseController = require('../api/controllers/expense.controller');

app.get('/store/:store_id', validator.validateHeaders, authorization.requiresLogin, expenseController.all);
app.get('/:expense_id', validator.validateHeaders, authorization.requiresLogin, expenseController.view);
app.post('/:expense_id', validator.validateHeaders, authorization.requiresLogin, expenseController.update);
app.delete('/:expense_id', validator.validateHeaders, authorization.requiresLogin, expenseController.delete);
app.put('/', validator.validateHeaders, authorization.requiresLogin, expenseController.register);

module.exports = app;
