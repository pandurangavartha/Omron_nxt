const Promise = require('bluebird');

const ProductSubCategory = require('../models/product-subcategory.model');
const Msg = require('../../config/strings');

exports.create = function (producSubtCategory) {
    return ProductSubCategory.findOne({
        subCategoryName: producSubtCategory.subCategoryName
    }).exec()
        .then(function (data) {
            if (data) {
                var err = new Error(Msg.SUBCATEGORY_EXISTS);
                err.status = 409;
                return Promise.reject(err);
            }
            console.log(producSubtCategory, "ProductSubCategory")
            return ProductSubCategory.create(producSubtCategory)
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

exports.update = function (productSubCategory, productSubCategoryId) {
    return ProductSubCategory.findByIdAndUpdate(productSubCategoryId, productSubCategory, {
        new: true,
        runValidators: true
    });
};
//
exports.view = function (productSubCategoryId) {
    return ProductSubCategory.findById(productSubCategoryId);
};
//
exports.delete = function (productSubCategoryId,req) {
    return ProductSubCategory.findByIdAndUpdate(productSubCategoryId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};
//
exports.getAll = function () {
    return ProductSubCategory.find({ deleted: { $exists: false } }).then(function (data) {
        return Promise.resolve(data);
    });
};
// Get Product categorywise sub products
exports.getCategoryWise = function (productCategoryId) {
    var query = {
        deleted: { $exists: false },
        "productCategory._id": productCategoryId
    };
    return ProductSubCategory.find(query).then(function (data) {
        return Promise.resolve(data);
    });
};