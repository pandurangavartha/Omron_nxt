'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

var StoreProductSchema = new Schema({

    _id: {
        type: String,
        default: shortid.generate
    },
    productName: {
        type: String,
//        required: 'Name is missing.'
    },
    shortCode: {
        type: String,
        required: 'Short code is missing.'
    },
    description: {
        type: String,
        required: 'Description is missing.'
    },
    store: {
        _id: {
            type: String,
            ref: "Store",
            required: 'Store _id is missing.'
        },
        storeName: String
    },
    brand: {type: String,
        ref: "Brand",
//        required: 'Category _id is missing.'
    },
    industry: {
        _id: {
            type: String,
            ref: "Industry",
            required: 'Industry _id is missing.' // newly added for grocerry
        },
        industryName: String
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "InActive"],
        default: "Active"
    },
//    brand: {
//        type: String,
//        required: 'Description is missing.'
//    },
    manufacturer: {
        type: String,
        required: 'Description is missing.'
    },
    wholeSaler: {
        type: Boolean,
        required: true,
        default: false
    },
    distributor: {
        type: Boolean,
        required: true,
        default: false
    },
    baseRetailPrice: {
        type: Number,
        required: 'Base retail price is missing.'
    },
    producPrice: [{
            type:{type: String},
            price: {type: Number},
            weight: {type: String}
        }],
    baseTaxPercent: {
        type: Number,
        required: 'Base tax percent is missing.'
    },
    variants: [{
            _id: {
                type: String,
                default: shortid.generate
            },
            variantName: {type: String, required: 'Variant name is missing.'},
            variantRetailPrice: {type: Number, required: 'Retail price is missing.'},
            variantTaxPercent: {type: Number, required: 'Tax percent is missing.'},
            features: [String],
            images: [String]
        }],
    features: [String],
    logo: String,
    images: [],
    categories: [{
            _id: {
                type: String,
                ref: "StoreCategory",
                required: 'Category _id is missing.'
            },
            categoryName: {type: String, required: 'Category name is missing.'},
            shortCode: String
        }],
    tags: {
        type: Array,
        required: false
    },
//    subcategories: [{
//            _id: {
//                type: String,
//                ref: "StoreSubCategory",
////                required: 'subCategory _id is missing.'
//            },
//            subcategoryName: {type: String },
////            subcategoryName: {type: String, required: 'Sub Category name is missing.'},
//            shortCode: String
//        }],
    vendors: [{
            _id: {
                type: String,
                ref: "Store",
                required: 'Vendor _id is missing.'
            },
            storeName: {type: String, required: 'Vendor name is missing.'},
        }],
    deleted: Boolean

}, {
    toJSON: {
        transform: function (doc, ret, options) {
            delete ret.__v;
            delete ret.statusl
            delete ret.deleted;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
});

StoreProductSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.status;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

StoreProductSchema.plugin(idvalidator)
StoreProductSchema.plugin(timestamps)

StoreProductSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("StoreProduct", StoreProductSchema);
