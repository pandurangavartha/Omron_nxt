'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var StoreSubCategorySchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    subCategoryName: {
        type: String,
//        required: 'Category Name is missing.',
//        unique: true
    },
    shortCode: {
        type: String,
        required: 'Short code is missing.'
    },
    productCategory: {
        _id: {
            type: String,
            ref: "StoreCategory",
            required: 'category _id is missing.'
        },
        categoryName: String
    },
    prodctMainCategoryId: {
        type: String,
        ref: "ProductCategory",
//            required: 'industry _id is missing.'
    },
    prodctMainSubCategoryId: {
        type: String,
        ref: "ProductSubCategory",
//            required: 'industry _id is missing.'
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

StoreSubCategorySchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

StoreSubCategorySchema.plugin(timestamps)
StoreSubCategorySchema.plugin(idvalidator)

StoreSubCategorySchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("StoreSubCategory", StoreSubCategorySchema);