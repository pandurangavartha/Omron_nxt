const BrandService = require('../services/brands.service');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.register = function (req, res, next) {
    var brandObj = req.body;
    if (req.file) {
        brandObj.brandLogo = req.file.path
    }
    console.log(brandObj, "bbbbbbbbbbbbb")
    BrandService.create(brandObj).then(function (industry) {
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
    var brandObj = req.body;
    console.log(req.files, "filess")
    if (req.file) {
        brandObj.brandLogo = req.file.path
    }
//    console.log(industry, "industryyyy")
    BrandService.update(brandObj, req.params.brand_id)
            .then(function (brand) {
                return res.send({result: brand});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.view = function (req, res, next) {
    BrandService.view(req.params.brand_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
exports.delete = function (req, res, next) {
    BrandService.delete(req.params.brand_id).then(function (data) {
        return res.send({result: data});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
exports.all = function (req, res, next) {
    BrandService.getAll().then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}