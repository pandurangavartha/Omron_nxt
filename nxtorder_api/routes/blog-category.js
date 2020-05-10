/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const uploadService = require('../api/services/upload.service');

const blogCategoryController = require('../api/controllers/blog-category.controller');

app.post('/', validator.validateHeaders, authorization.requiresLogin, blogCategoryController.register);
app.post('/:blog_id', validator.validateHeaders, authorization.requiresLogin,blogCategoryController.update);
//app.get('/', validator.validateHeaders, authorization.requiresLogin, blogCategoryController.all);
app.get('/', blogCategoryController.all);
app.get('/:blog_id', validator.validateHeaders, authorization.requiresLogin, blogCategoryController.view);
app.delete('/:blog_id', validator.validateHeaders, authorization.requiresLogin, blogCategoryController.delete);


module.exports = app;
