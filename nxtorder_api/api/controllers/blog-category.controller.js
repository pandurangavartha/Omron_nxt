 const BlogCategoryService = require('../services/blog-category.service');

exports.register = function (req, res, next) {
    var blogCategoryObj = req.body

    BlogCategoryService.create(blogCategoryObj).then(function (blogCategory) {
        return res.send({ result: blogCategory });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
//
exports.update = function (req, res, next) {
    var blogCategory = req.body
    BlogCategoryService.update(blogCategory, req.params.blog_id)
        .then(function (productCategory) {
            return res.send({ result: blogCategory });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};
//
exports.view = function (req, res, next) {
    BlogCategoryService.view(req.params.blog_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
//
exports.delete = function (req, res, next) {
    BlogCategoryService.delete(req.params.blog_id).then(function (blogCategory) {
        return res.send({ result: blogCategory });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
//
exports.all = function (req, res, next) {
    BlogCategoryService.getAll().then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
}

