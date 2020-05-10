const Promise = require('bluebird');

//const Product = require('../models/product.model');
const StoreProduct = require('../models/store-product.model');
const Industry = require('../models/industry.model');
const Offer = require('../models/offer.model');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.create = function (offerObj, productId, industryId) {
//    console.log(offerObj, "offerCriteria")
    return StoreProduct.findById(productId)
            .then(function (product) {
                if (product != null && product.store != null) {
                    var productObj = {
                        _id: product._id,
                        productName: product.productName,
                        shortCode: product.shortCode,
                        baseRetailPrice: product.baseRetailPrice,
                        baseTaxPercent: product.baseTaxPercent
                    }

                    if (offerObj.variant) {
                        var variant = _.find(product.variants, {
                            '_id': offerObj.variant._id
                        })
                        offerObj.variant = variant
                    }
                    offerObj.status = 'Approved'

                    if (offerObj.category) {
                        var category = _.find(product.categories, {
                            '_id': offerObj.category._id
                        })
                        offerObj.category = category
                    }

//                offerObj.startDate = new Date(offerObj.startDate)
//                offerObj.endDate = new Date(offerObj.endDate)

                    offerObj.product = productObj
                    offerObj.store = product.store;
                    return Industry.findById(industryId)
                            .then(function (industry) {
                                offerObj.industry = product.industry;
//                                console.log(offerObj, "offerObj")
//                                console.log("innnnnnnn", offerObj)
                                return Offer.create(offerObj);
                            })

                } else {
                    var err1 = new Error(Msg.MISSING_PRODUCT);
                    err1.status = 400;
                    return Promise.reject(err1);
                }
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

exports.update = function (offer, offerId) {
    return Offer.findByIdAndUpdate(offerId, offer, {
        new : true,
        runValidators: true
    });
};

exports.view = function (offerId) {
    return Offer.findById(offerId);
};

exports.delete = function (offerId) {
    return Offer.findByIdAndUpdate(offerId, {deleted: true}, {new : true, runValidators: true});
};

exports.getAll = function (productId, req) {

    var query = {
        deleted: {$exists: false},
        "product._id": productId
    };

    if (req.storeName) {
        query['store.storeName'] = new RegExp(req.storeName, 'i')
    }

    if (req.productName) {
        query['product.productName'] = new RegExp(req.productName, 'i')
    }

    if (req.variantName) {
        query['variant.variantName'] = new RegExp(req.variantName, 'i')
    }

    if (req.categoryName) {
        query['category.categoryName'] = new RegExp(req.categoryName, 'i')
    }

    if (req.offerType) {
        query['offerType'] = req.offerType
    }
     if (req.industry_id) {
        query["industry._id"] = req.industry_id;
    }
    return Offer.find(query);

};

exports.getAllProducts = function (req) {
    console.log(req, 'query')
    var query = {
        deleted: {$exists: false},
//        "store._id": storeId
    };
    if (req.industry_id) {
        query["industry._id"] = req.industry_id;
    }
    if (req.offerType) {
        query['offerType'] = req.offerType
    }
//    return Offer.find(query, { _id: false, product: true });
    return Offer.find(query, {_id: false});
};
//exports.getAllProducts = function (storeId, req) {
//
//    var query = {
//        deleted: { $exists: false },
//        "store._id": storeId
//    };
//    console.log(req, 'reqqqqqqqq')
////    if (req.storeName) {
////        query['store.storeName'] = new RegExp(req.storeName, 'i')
////    }
////
////    if (req.productName) {
////        query['product.productName'] = new RegExp(req.productName, 'i')
////    }
////
////    if (req.variantName) {
////        query['variant.variantName'] = new RegExp(req.variantName, 'i')
////    }
////
////    if (req.categoryName) {
////        query['category.categoryName'] = new RegExp(req.categoryName, 'i')
////    }
//
//    if (req.offerType) {
//        query['offerType'] = req.offerType
//    }
//
//    return Offer.find(query);
//
//};