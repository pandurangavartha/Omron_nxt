const Promise = require('bluebird');

const ProductCategory = require('../models/product-category.model');
const Msg = require('../../config/strings');

exports.create = function (productCategory) {
    return ProductCategory.findOne({
        categoryName: productCategory.categoryName
    }).exec()
        .then(function (data) {
            if (data) {
                var err = new Error(Msg.CATEGORY_EXISTS);
                err.status = 409;
                return Promise.reject(err);
            }
            return ProductCategory.create(productCategory)
                .then(function (data) {
                    return Promise.resolve(data);
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

exports.update = function (productCategory, productCategoryId) {
    return ProductCategory.findByIdAndUpdate(productCategoryId, productCategory, {
        new: true,
        runValidators: true
    });
};

exports.view = function (productCategoryId) {
    return ProductCategory.findById(productCategoryId);
};

exports.delete = function (productCategoryId) {
    return ProductCategory.findByIdAndUpdate(productCategoryId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};

exports.getAll = function (req) {
    var query = {
         deleted: { $exists: false },
    }
    if(req.industry_id) {
        query["industry._id"] = req.industry_id;
    }
    console.log(query, "queryyyy")
    return ProductCategory.find(query).then(function (data) {
        console.log(data, "dataaaaa")
        return Promise.resolve(data);
    });
};
// get industry id wise categories
exports.industryWiseCategories = function (industry_id) {
    var query = {
        deleted: { $exists: false },
        "industry._id": industry_id,
        "parent_id":"0"
    };
    return ProductCategory.find(query).then(function (data) {
        return Promise.resolve(data);
    });
};