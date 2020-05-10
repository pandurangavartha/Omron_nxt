/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const uploadService = require('../api/services/upload.service');

const blogsController = require('../api/controllers/blogs.controller');
const blogsLikesController = require('../api/controllers/blog-likes.controller');

app.post('/', validator.validateHeaders, authorization.requiresLogin,uploadService.blogsUpload.single('image'), blogsController.register);
app.post('/:blog_id', validator.validateHeaders, authorization.requiresLogin,blogsController.update);
//app.get('/', validator.validateHeaders, authorization.requiresLogin, blogsController.all);
app.get('/', blogsController.all);
app.get('/:blog_id', validator.validateHeaders, authorization.requiresLogin, blogsController.view);
//app.delete('/:industry_id', validator.validateHeaders, authorization.requiresLogin, industryController.delete);


//blogs likes
app.put('/likes', validator.validateHeaders, authorization.requiresLogin, blogsLikesController.register);
//app.post('/:blog_id', validator.validateHeaders, authorization.requiresLogin,blogsLikesController.update);
////app.get('/', validator.validateHeaders, authorization.requiresLogin, blogsController.all);
//app.get('/', blogsLikesController.all);
//app.get('/:blog_id', validator.validateHeaders, authorization.requiresLogin, blogsLikesController.view);
module.exports = app;
