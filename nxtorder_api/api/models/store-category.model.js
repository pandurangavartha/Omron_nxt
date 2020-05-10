'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var StoreCategorySchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    categoryName: {
        type: String,
//        required: 'Category Name is missing.',
//        unique: false
    },
    shortCode: {
        type: String,
        required: 'Short code is missing.'
    },
    parent_id: {type: String, ref: "StoreCategory", default: 0},
    image: [String],
    industry: {
        _id: {
            type: String,
            ref: "Industry",
            required: 'industry _id is missing.'
        },
        industryName: String
    },
    prodctMainCategoryId: {
        type: String,
        ref: "ProductCategory",
//            required: 'industry _id is missing.'
    },
    storeId: {
//        _id: {
        type: String,
        ref: "Store",
        required: 'Store _id is missing.'
//        },
//        storeName: String
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

StoreCategorySchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

StoreCategorySchema.plugin(timestamps)
StoreCategorySchema.plugin(idvalidator)

StoreCategorySchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("StoreCategory", StoreCategorySchema);