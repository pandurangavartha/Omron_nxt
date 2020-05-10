const ProductCategoryService = require('../services/product-category.service');
const _ = require('lodash');
exports.register = function (req, res, next) {
    var productCategoryObj = req.body;
    var banners = [];
    console.log(req.files, "filesssssssss")
    if (req.files) {
        _.each(req.files, function (obj) {
//            var path1 = 
            const pa = 'public/bulkuploads/' +obj.filename
            const pa1 = obj.path
            console.log(pa1, "paaaaa")
            var object = {
                banner: pa
            }
            banners.push(pa)

        })
        console.log(banners, 'banners')
        productCategoryObj.image = banners
    }
    ProductCategoryService.create(productCategoryObj).then(function (productCategory) {
        return res.send({result: productCategory});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.update = function (req, res, next) {
    var productCategory = req.body
    ProductCategoryService.update(productCategory, req.params.category_id)
            .then(function (productCategory) {
                return res.send({result: productCategory});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.view = function (req, res, next) {
    ProductCategoryService.view(req.params.category_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.delete = function (req, res, next) {
    ProductCategoryService.delete(req.params.category_id).then(function (productCategory) {
        return res.send({result: productCategory});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.all = function (req, res, next) {
    ProductCategoryService.getAll(req.query).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}
// get industry id wise categories
exports.industryWisecategories = function (req, res, next) {
    console.log(req.params.industry_id, "req.params.industry_id")
    ProductCategoryService.industryWiseCategories(req.params.industry_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
