const Promise = require('bluebird');

const ProductRating = require('../models/product-rating.model');
const Msg = require('../../config/strings');
const mongoose = require('mongoose');
const _ = require('lodash');


exports.create = function (ratingObj) {
//    return ProductRating.findOne({
//        industryName: industryObj.industryName
//    }).exec()
//        .then(function (industry) {

//            if (industry && industry.status === 'InActive') {
//                var err = new Error(Msg.INDUSTRY_DEACTIVATED);
//                err.status = 204;
//                return Promise.reject(err);
//            }
//
//            if (industry) {
//                var err = new Error(Msg.INDUSTRY_EXISTS);
//                err.status = 409;
//                return Promise.reject(err);
//            }

            return ProductRating.create(ratingObj)
                .then(function (rating) {
                    return Promise.resolve(rating);;
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
//        })
};

exports.update = function (industry, industryId) {
    return Industry.findByIdAndUpdate(industryId, industry, {
        new: true,
        runValidators: true
    });
};
exports.view = function (industryId) {
    return Industry.findById(industryId);
};

exports.delete = function (industryId) {
    return Industry.findByIdAndUpdate(industryId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};

exports.getAll = function () {
    var query = {
        deleted: { $exists: false },
        status:"Active"
    }
    return Industry.find(query).then(function (data) {
        return Promise.resolve(data);
    });
};