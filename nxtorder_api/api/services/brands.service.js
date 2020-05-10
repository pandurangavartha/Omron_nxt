const Promise = require('bluebird');

const Brand = require('../models/brands.model');
const Msg = require('../../config/strings');
const mongoose = require('mongoose');
const _ = require('lodash');


exports.create = function (brandObj) {
    return Brand.findOne({
        name: brandObj.name
    }).exec()
            .then(function (brands) {

                if (brands && brands.status === 'InActive') {
                    var err = new Error(Msg.INDUSTRY_DEACTIVATED);
                    err.status = 204;
                    return Promise.reject(err);
                }

                if (brands) {
                    var err = new Error(Msg.INDUSTRY_EXISTS);
                    err.status = 409;
                    return Promise.reject(err);
                }

                return Brand.create(brandObj)
                        .then(function (brand) {
                            return Promise.resolve(brand);
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
            })
};

exports.update = function (brand, brandId) {
    const query = {
        _id: brandId
    }
    return Brand.find(query).exec()
            .then(function (data) {
                var banners = [];

                if (data) {                    
                    return Brand.findByIdAndUpdate(brandId, brand, {
                        new : true,
                        runValidators: true
                    });
                }
            });

};
exports.view = function (brandId) {
    return Brand.findById(brandId);
};

exports.delete = function (brandId) {
    return Brand.findByIdAndUpdate(brandId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};

exports.getAll = function () {
    var query = {
        deleted: {$exists: false},
        status: "Active"
    }
    return Brand.find(query).then(function (data) {
        return Promise.resolve(data);
    });
};