const Promise = require('bluebird');

//const Product = require('../models/product.model');
const Coupon = require('../models/coupons.model');
const User = require('../models/user.model');
const Industry = require('../models/industry.model');
const Store = require('../models/store.model');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.create = function (couponObj, req) {
    return User.findById(couponObj.user)
            .then(function (user) {
                console.log(user, "user")
                console.log(req.file.path, "couponObjcouponObj")
                if (req.file) {
                    couponObj.logo = req.file.path
                }


//                couponObj.product = couponObj
//                couponObj.store = product.store
                var user = {
                    "_id": user.id,
                    "name": user.firstName,
                    "username": user.username
                }
                var store = {
                    _id: couponObj.store,
                    storeName: couponObj.storeName
                }
                var industry = {
                    _id: couponObj.industry,
                    industryName: couponObj.industryName
                }

                couponObj.user = user;
                couponObj.store = store;
                couponObj.industry = industry;
                couponObj.couponStatus = "Approved"
                console.log(couponObj, "couponObjcouponObjcouponObj")
                return Coupon.create(couponObj)
//            } else {
//                var err1 = new Error(Msg.MISSING_PRODUCT);
//                err1.status = 400;
//                return Promise.reject(err1);
//            }
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
};

exports.update = function (coupon, couponId) {
    return User.findById(coupon.user)
            .then(function (user) {
                var store = {
                    _id: coupon.store,
                    storeName: coupon.storeName
                }
                var industry = {
                    _id: coupon.industry,
                    industryName: coupon.industryName
                }

//                couponObj.user = user;
                coupon.store = store;
                coupon.industry = industry;
                return Coupon.findByIdAndUpdate(couponId, coupon, {
                    new : true,
                    runValidators: true
                });
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
};

exports.view = function (couponId) {
    return Coupon.findById(couponId);
};

exports.delete = function (couponId) {
    return Coupon.findByIdAndUpdate(couponId, {deleted: true}, {new : true, runValidators: true});
};

//exports.getAll = function (userId, req) {
exports.getAll = function (req) {
//    if(req.cou) {
    var query = {
        deleted: {$exists: false},
//        "user._id": userId
    };

    if (req.user_Id) {
        query['user._id'] = req.user_Id,
                query.couponType = "Individual",
                query.couponStatus = "Approved"
    } else {
        query.couponType = "Overall";
        query.couponStatus = "Approved";
    }
    if (req.user_Id && req.couponStatus) {
        query['user._id'] = req.user_Id,
                query.couponType = "Individual",
                query.couponStatus = req.couponStatus
    } else {
        query.couponType = "Overall";
        query.couponStatus = "Approved";
//        query.couponStatus = req.couponStatus;

    }
    if (req.industry_id) {
        query['industry._id'] = req.industry_id,
                query.couponStatus = "Approved";

        query.couponType = "Individual"
    }
    return Coupon.find(query);
};

//exports.getAll = function (userId, req) {
exports.getUserCoupons = function (req, userId) {
//    if(req.cou) {
    var query = {
        deleted: {$exists: false},
        "user._id": userId
    };
//    if(req.industry_id) {
//        query['industry._id'] = industry_id 
//    }
    return Coupon.find(query);
};

exports.getAllProducts = function (storeId) {
    var query = {
        deleted: {$exists: false},
        "store._id": storeId
    };
    return Offer.find(query, {_id: false, product: true});
};