const Promise = require('bluebird');

const BlogsLikes = require('../models/blog-likes.model');
const Blogs = require('../models/blogs.model');
const Msg = require('../../config/strings');
console.log("in service")
exports.createBlogsLikes = function (blogLikes) {
    console.log("innnnnnnnnn blogssssssss")
//    return Blogs.find({
//        _id: blogLikes.blogs
//    }).exec()
//            .then(function (data) {
//                if (data) {
//                    var err = new Error(Msg.CATEGORY_EXISTS);
//                    err.status = 409;
//                    return Promise.reject(err);
//                }
//                console.log(data, 'data')
                blogLikes['blogs._id'] = blogLikes.blogs;
                console.log(blogLikes, 'blogLikesblogLikes')

                return BlogsLikes.create(blogLikes)
                        .then(function (data) {
                            return Promise.resolve(data);
                            ;
                        }).catch(function (err) {
                    if (err.name === 'ValidationError') {
                        var err1 = new Error(err.message);
                        err1.status = 400;
                        return Promise.reject(err1);
                    }
                    var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
                    err2.status = 500;
                    return Promise.reject(err2);
                });
//            })
};
//
exports.update = function (blogData, blogId) {
    return Blogs.findByIdAndUpdate(blogId, blogData, {
        new : true,
        runValidators: true
    });
};
//
exports.view = function (blogId) {
    return Blogs.findById(blogId);
};
//
//exports.delete = function (productCategoryId) {
//    return ProductCategory.findByIdAndUpdate(productCategoryId, { deleted: true }, {
//        new: true,
//        runValidators: true
//    });
//};
//
exports.getAll = function () {
    return Blogs.find({deleted: {$exists: false}}).then(function (data) {
        return Promise.resolve(data);
    });
};
