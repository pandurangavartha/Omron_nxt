'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var ProductLotPricingSchema = new Schema({
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
        storeName: String
    },
    lotSize: {
        type: Number,
        required: 'Lot size is missing.'
    },
    lotPrice: {
        type: Number,
        required: 'Lot price is missing.'
    },
    discount: Number,
    discountIsPercent: Boolean,
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

ProductLotPricingSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

ProductLotPricingSchema.plugin(idvalidator)
ProductLotPricingSchema.plugin(timestamps)

ProductLotPricingSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("ProductLotPricing", ProductLotPricingSchema);