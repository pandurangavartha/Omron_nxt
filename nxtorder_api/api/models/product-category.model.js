'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var ProductCategorySchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    categoryName: {
        type: String,
        required: 'Category Name is missing.',
        unique: true
    },
    shortCode: {
        type: String,
        required: 'Short code is missing.'
    },
    subCategories: {
        type: Array,
        items: {
            type: String, ref: "ProductCategory"
        }
    },
    parent_id: {type: String, ref: "ProductCategory", default: 0},
    industry: {
        _id: {
            type: String,
            ref: "Industry",
            required: 'industry _id is missing.'
        },
        industryName: String
    },
    image: [String],
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

ProductCategorySchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

ProductCategorySchema.plugin(timestamps)
ProductCategorySchema.plugin(idvalidator)

ProductCategorySchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("ProductCategory", ProductCategorySchema);