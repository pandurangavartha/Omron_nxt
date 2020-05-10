const Promise = require('bluebird');

const Product = require('../models/product.model');
const FlashSale = require('../models/fashsale.model');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.create = function (flashObj, productId) {
    return Product.findById(productId)
        .then(function (product) {
            if (product != null && product.store != null) {
                var productObj = {
                    _id: product._id,
                    productName: product.productName,
                    shortCode: product.shortCode,
                    baseRetailPrice: product.baseRetailPrice,
                    baseTaxPercent: product.baseTaxPercent
                }

                if (flashObj.variant) {
                    var variant = _.find(product.variants, {
                        '_id': flashObj.variant._id
                    })
                    flashObj.variant = variant
                }

                if(flashObj.category) {
                    var category = _.find(product.categories, {
                        '_id': flashObj.category._id
                    })
                    flashObj.category = category
                }
                
                flashObj.product = productObj
                flashObj.store = product.store
                
                return FlashSale.create(flashObj)
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
        new: true,
        runValidators: true
    });
};

exports.view = function (offerId) {
    return Offer.findById(offerId);
};

exports.delete = function (offerId) {
    return Offer.findByIdAndUpdate(offerId, { deleted: true }, { new: true, runValidators: true });
};

exports.getAll = function (productId, req) {

    var query = {
        deleted: { $exists: false },
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

    return Offer.find(query);

};

exports.getAllProducts = function (storeId) {
    var query = {
        deleted: { $exists: false },
        "store._id": storeId
    };
    return Offer.find(query, { _id: false, product: true });
};