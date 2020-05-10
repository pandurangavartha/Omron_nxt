const Promise = require('bluebird');

const Industry = require('../models/industry.model');
const Msg = require('../../config/strings');
const mongoose = require('mongoose');
const _ = require('lodash');


exports.create = function (industryObj) {
    return Industry.findOne({
        industryName: industryObj.industryName
    }).exec()
            .then(function (industry) {

                if (industry && industry.status === 'InActive') {
                    var err = new Error(Msg.INDUSTRY_DEACTIVATED);
                    err.status = 204;
                    return Promise.reject(err);
                }

                if (industry) {
                    var err = new Error(Msg.INDUSTRY_EXISTS);
                    err.status = 409;
                    return Promise.reject(err);
                }

                return Industry.create(industryObj)
                        .then(function (industry) {
                            return Promise.resolve(industry);
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

exports.update = function (industry, industryId) {
    const query = {
        _id: industryId
    }
    return Industry.find(query).exec()
            .then(function (data) {
                var banners = [];

                if (data) {
                    _.each(data[0].banners, function (obj) {
                        console.log(obj, "objjjjjjjjjjj")
//                        banners.push(obj.banner)
                        const finalobj = {
                            banner:obj.banner
                        }
                        industry['banners'].push(finalobj)

                    })

//                    industry['bannerss
                    console.log(data, "data")
                    console.log(industry, "iindustry`1111111111")
                    return Industry.findByIdAndUpdate(industryId, industry, {
                        new : true,
                        runValidators: true
                    });
                }
            });

};
exports.view = function (industryId) {
    return Industry.findById(industryId);
};

exports.delete = function (industryId) {
    return Industry.findByIdAndUpdate(industryId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};

exports.getAll = function () {
    var query = {
        deleted: {$exists: false},
        status: "Active"
    }
    return Industry.find(query).then(function (data) {
        return Promise.resolve(data);
    });
};