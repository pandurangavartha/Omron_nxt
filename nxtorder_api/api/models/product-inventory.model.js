'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var ProductInventorySchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    product: {
        _id: {
            type: String,
            ref: "Product",
            required: 'Product _id is missing.'
        },
        productName: String,
        shortCode: String,
        baseRetailPrice: Number,
        baseTaxPercent: Number
    },
    variant: {
        _id: String,
        variantName: String,
        variantRetailPrice: Number,
        variantTaxPercent: Number,
        features: [String],
        images: [String]
    },
    store: {
        _id: {
            type: String,
            ref: "Store",
            required: 'Store _id is missing.'
        },
        storeName: String,
    },
    procurementId: {
        type: String,
        ref: "Procurement"
    },
    barcodeBase64: String,
    serialNo: {
        type: String,
        required: 'Serial No is missing.'
    },
    batchNo: {
        type: String,
        required: 'Batch No is missing.'
    },
    expiryDate: {
        type: String
    },
    status: {
        type: String,
        enum: ['Available', 'Sold'],
        default: 'Available'
    },
    deleted: Boolean

}, {
        toJSON: {
            transform: function (doc, ret, options) {
                delete ret.__v;
                delete ret.deleted;
                delete ret.createdAt;
                delete ret.updatedAt;
            }
        }
    });

ProductInventorySchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

ProductInventorySchema.plugin(idvalidator)
ProductInventorySchema.plugin(timestamps)

ProductInventorySchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("ProductInventory", ProductInventorySchema);
