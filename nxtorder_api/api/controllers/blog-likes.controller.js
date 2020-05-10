const BlogsLikesService = require('../services/blog-likes.service');
const _ = require('lodash');
console.log(BlogsLikesService, "BlogsLikesServiceBlogsLikesService")
exports.register = function (req, res, next) {
    var blogslikesObj = req.body;
        blogslikesObj.user = req.user;
//    blogsObj.htmlBody = JSON.stringify(req.body.htmlBody);
    console.log(blogslikesObj, "objjjjjjjkkkkkkkkkkkkkkk")
        BlogsLikesService.createBlogsLikes(blogslikesObj).then(function (blogs) {
            console.log(blogs,"bloggggggggggggggggg")
            return res.send({result: blogs});
        }).catch(function (err) {
            return res.status(400).send({result: {error: err.message}})
        });
};
//
exports.update = function (req, res, next) {
    var blogObj = req.body;
    console.log(blogObj, "blogObjblogObj")
    if (req.body.htmlBody) {
        blogObj.htmlBody = JSON.stringify(req.body.htmlBody);
    }
    if (req.file) {
        blogObj.logo = req.file.path
    }
    BlogsService.update(blogObj, req.params.blog_id)
            .then(function (blogData) {
                return res.send({result: blogData});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};
//
exports.view = function (req, res, next) {
    BlogsService.view(req.params.blog_id).then(function (data) {
        data.htmlBody = JSON.parse(data.htmlBody)
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
//exports.delete = function (req, res, next) {
//    ProductCategoryService.delete(req.params.category_id).then(function (productCategory) {
//        return res.send({ result: productCategory });
//    }).catch(function (err) {
//        return res.status(400).send({ result: { error: err.message } })
//    });
//};
//
exports.all = function (req, res, next) {
    BlogsService.getAll().then(function (data) {
        _.each(data, function (obj) {
            obj.htmlBody = JSON.parse(obj.htmlBody)
        })
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}

