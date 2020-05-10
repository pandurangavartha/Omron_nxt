 const ProductSubCategoryService = require('../services/product-subcategory.service');

exports.register = function (req, res, next) {
    var productSubCategoryObj = req.body;
    console.log("in sub category")        
    ProductSubCategoryService.create(productSubCategoryObj).then(function (productSubCategory) {
        return res.send({ result: productSubCategory });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.update = function (req, res, next) {
    var productSubCategory = req.body
    ProductSubCategoryService.update(productSubCategory, req.params.subcategory_id)
        .then(function (productSubCategory) {
            return res.send({ result: productSubCategory });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};
//
exports.view = function (req, res, next) {
    ProductSubCategoryService.view(req.params.subcategory_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
//
exports.delete = function (req, res, next) {
    ProductSubCategoryService.delete(req.params.subcategory_id).then(function (productSubCategory) {
        return res.send({ result: productSubCategory });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.all = function (req, res, next) {
    ProductSubCategoryService.getAll().then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
}

exports.getCategoryWise = function (req, res, next) {
    console.log("innnnnnnnnnn", "categoryyyyyy")
    ProductSubCategoryService.getCategoryWise(req.params.category_id).then(function (productSubCategory) {
        return res.send({ result: productSubCategory });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};