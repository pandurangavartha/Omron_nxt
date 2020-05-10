const Promise = require('bluebird');

const Product = require('../models/product.model');
const ProductLotPricing = require('../models/product-lot-pricing.model');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.create = function (productLotPricingObj, productId) {

    return Product.findById(productId)
        .then(function (product) {
            var productObj= {
                _id: product._id,
                productName: product.productName,
                shortCode: product.shortCode,
                baseRetailPrice: product.baseRetailPrice,
                baseTaxPercent: product.baseTaxPercent
            }
            var variant = _.find(product.variants, {
                '_id' : productLotPricingObj.variant._id
            })
            
            productLotPricingObj.variant = variant
            productLotPricingObj.product = productObj
            productLotPricingObj.store = product.store
            return ProductLotPricing.create(productLotPricingObj)
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

exports.update = function (productLotPricing, productLotPricingId) {
    return ProductLotPricing.findByIdAndUpdate(productLotPricingId, productLotPricing, {
        new: true,
        runValidators: true
    });
};

exports.view = function (productLotPricingId) {
    return ProductLotPricing.findById(productLotPricingId);
};

exports.delete = function (productLotPricingId) {
    return ProductLotPricing.findByIdAndUpdate(productLotPricingId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};

exports.getLotsForProduct = function (productId, req) {

    var query = {
        deleted: { $exists: false },
        'product._id': productId
    };

    if (req.productName) {
        query['product.productName'] = new RegExp(req.productName, 'i')
    }

    if (req.variantName) {
        query['variant.variantName'] = new RegExp(req.variantName, 'i')
    }

    return ProductLotPricing.find(query)
};
