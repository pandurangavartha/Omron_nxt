'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var BlogCategorySchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    categoryName: {
        type: String,
        required: 'Blog Category Name is missing.',
        unique: true
    },
    shortCode: {
        type: String,
        required: 'Blog Short code is missing.'
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

BlogCategorySchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

BlogCategorySchema.plugin(timestamps)
BlogCategorySchema.plugin(idvalidator)

BlogCategorySchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("BlogCategory", BlogCategorySchema);