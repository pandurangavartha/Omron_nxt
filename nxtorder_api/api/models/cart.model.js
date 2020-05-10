'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var CartSchema = new Schema({

    _id: {
        type: String,
        default: shortid.generate
    },
    store: {
        _id: {
            type: String,
            ref: "Store",
            required: 'Store _id is missing.'
        },
        storeName: String
    },
    user: {
        _id: {
            type: String,
            ref: "User",
            required: 'User _id is missing.'
        },
        name: String,
        username: String
    },
    product: {
        _id: {
            type: String,
            ref: "StoreProduct",
            required: 'Product _id is missing.'
        },
        productName: String,
        shortCode: String,
        baseRetailPrice: Number,
        baseTaxPercent: Number,
        logo: [String]
    },
    variant: {
        _id: String,
        variantName: String,
        variantRetailPrice: Number,
        variantTaxPercent: Number,
        features: [String],
        images: [String]
    },
    price: {
        type: Number,
        required: 'Price is missing.'
    },
    quantity: {
        type: Number,
        required: 'Quantity is missing.'
    },
    taxPercent: {
        type: Number,
        required: 'Tax Percent is missing.'
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

CartSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

CartSchema.plugin(timestamps);
CartSchema.plugin(idvalidator);

CartSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("Cart", CartSchema);
