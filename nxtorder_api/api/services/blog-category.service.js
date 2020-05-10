const Promise = require('bluebird');

const BlogCategory = require('../models/blog-category.model');
const Msg = require('../../config/strings');

exports.create = function (blogCategory) {
    return BlogCategory.findOne({
        categoryName: BlogCategory.categoryName
    }).exec()
        .then(function (data) {
            if (data) {
                var err = new Error(Msg.CATEGORY_EXISTS);
                err.status = 409;
                return Promise.reject(err);
            }
            console.log( blogCategory );
            return BlogCategory.create(blogCategory)
                .then(function (data) {
                    return Promise.resolve(data);;
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
        })
};

exports.update = function (blogCategory, blogCategoryId) {
    return BlogCategory.findByIdAndUpdate(blogCategoryId, blogCategory, {
        new: true,
        runValidators: true
    });
};

exports.view = function (blogCategoryId) {
    return BlogCategory.findById(blogCategoryId);
};

exports.delete = function (blogCategoryId) {
    return BlogCategory.findByIdAndUpdate(blogCategoryId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};

exports.getAll = function () {
    return BlogCategory.find({ deleted: { $exists: false } }).then(function (data) {
        return Promise.resolve(data);
    });
};
