const ProductRatingService = require('../services/product-rating.service');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.register = function (req, res, next) {
    var ratingObj = req.body;
    ratingObj.user = req.user;
//    console.log("innnnnnnnnnnnn")
//    ratingObj = {
//        industryName: req.body.industryName,
//        code: req.body.code,
//        status: 'Pending Approval',
//    }
//    console.log(req.files, industryObj, "fileeeeeeeeeeeee")
    var banners = []
    if (req.files) {
        _.each(req.files, function (obj) {
            var object = {
                banner: obj.path
            }
            banners.push(obj.path)

        })
        ratingObj.image = banners
    }
    ratingObj["product._id"]= ratingObj.product_id;
//    return false;
    console.log(ratingObj,  "ratingObjratingObj")
//    return false;
    ProductRatingService.create(ratingObj).then(function (industry) {
        if (industry) {
            return res.send({result: industry});
        } else {
            return res.status(400).send({result: {error: Msg.INDUSTRY_CREATION_FAILED}})
        }
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}
exports.update = function (req, res, next) {
    var industry = req.body;
    var banners = [];
    if (req.files) {
        _.each(req.files, function (obj) {
            var object = {
                banner: obj.path
            }
            banners.push(object)

        })
        industry.banners = banners
    }
    IndustryService.update(industry, req.params.industry_id)
            .then(function (industry) {
                return res.send({result: industry});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.view = function (req, res, next) {
    IndustryService.view(req.params.industry_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
exports.delete = function (req, res, next) {
    IndustryService.delete(req.params.industry_id).then(function (data) {
        return res.send({result: data});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
exports.all = function (req, res, next) {
    IndustryService.getAll().then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}