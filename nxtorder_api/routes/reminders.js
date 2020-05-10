/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const reminderController = require('../api/controllers/reminders.controller');

app.post('/create', validator.validateHeaders, authorization.requiresLogin, reminderController.add);
app.get('/list', validator.validateHeaders, authorization.requiresLogin, reminderController.list);
app.get('/:reminderId', validator.validateHeaders, authorization.requiresLogin, reminderController.getById );
app.patch('/update/:reminderId', validator.validateHeaders, authorization.requiresLogin, reminderController.update);
app.delete('/:reminderId', validator.validateHeaders, authorization.requiresLogin, reminderController.delete );

module.exports = app;