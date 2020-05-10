'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var ProductSubCategorySchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    subCategoryName: {
        type: String,
        required: 'Category Name is missing.',
        unique: true
    },
    shortCode: {
        type: String,
        required: 'Short code is missing.'
    },
    productCategory: {
        _id: {
            type: String,
            ref: "ProductCategory",
            required: 'product _id is missing.'
        },
        categoryName: String
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

ProductSubCategorySchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

ProductSubCategorySchema.plugin(timestamps)
ProductSubCategorySchema.plugin(idvalidator)

ProductSubCategorySchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("ProductSubCategory", ProductSubCategorySchema);