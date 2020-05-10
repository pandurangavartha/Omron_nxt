const Promise = require('bluebird');

const Store = require('../models/store.model');
const Product = require('../models/product.model');
const ProductInventory = require('../models/product-inventory.model');
const _ = require('lodash');
const Msg = require('../../config/strings');

exports.create = function (productInventoryObj, storeId) {

    return Product.findById(productInventoryObj.product._id)
        .then(function (product) {
            var storeObj = {
                _id: product.store._id,
                storeName: product.store.storeName
            }
            productInventoryObj.store = storeObj

            if (productInventoryObj.variant) {
                var variant = _.find(product.variants, {
                    '_id': productInventoryObj.variant._id
                })
                productInventoryObj.variant = variant
            }
            
            var productObj = {
                _id: product._id,
                productName: product.productName,
                shortCode: product.shortCode,
                baseRetailPrice: product.baseRetailPrice,
                baseTaxPercent: product.baseTaxPercent
            }
            productInventoryObj.product = productObj
            
            return ProductInventory.create(productInventoryObj)
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

exports.update = function (productInventory, productInventoryId) {
    return ProductInventory.findByIdAndUpdate(productInventoryId, productInventory, {
        new: true,
        runValidators: true
    });
};

exports.view = function (productInventoryId) {
    return ProductInventory.findById(productInventoryId);
};

exports.delete = function (productInventoryId) {
    return ProductInventory.findByIdAndUpdate(productInventoryId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};

exports.getAll = function (storeId, req) {

    var query = { deleted: { $exists: false }, 'store._id': storeId };

    if (req.product_name) {
        query['product.productName'] = new RegExp(req.product_name + 'i')
    }

    if (req.variant_name) {
        query['variant.variantName'] = new RegExp(req.variant_name + 'i')
    }

    if (req.serial_no) {
        query['serialNo'] = req.serial_no
    }

    if (req.batch_no) {
        query['batchNo'] = req.batch_no
    }

    if (req.status) {
        query['status'] = req.status
    } else {
        query['status'] = 'Available'
    }

    return ProductInventory.find(query);
};

exports.inventoryProducts = function (storeId, req) {
    var query = { deleted: { $exists: false }, 'store._id': storeId };
    return ProductInventory.distinct('product', query)
};