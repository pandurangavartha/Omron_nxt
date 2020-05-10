'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

var BlogsSchema = new Schema({

    _id: {
        type: String,
        default: shortid.generate
    },
//    category: {
//        type: String,
//        required: 'Category Name is missing.'
//    },
    title: {
        type: String,
        required: 'Title is missing.'
    },
    category: {
        _id: {
            type: String,
            ref: "BlogCategory",
            required: 'Category _id is missing.'
        },
        categoryName: {type: String, required: 'Category name is missing.'},
    },
//    image: {
//        type: String,
//        required: 'Title is missing.'
//    },
    htmlBody: {
        type: String,
        required: 'Body is missing.'
    },
    tags: {
        type: Array,
        required: false
    },
    image: String,
    deleted: Boolean

}, {
    toJSON: {
        transform: function (doc, ret, options) {
            delete ret.__v;
//            delete ret.status
            delete ret.deleted;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
});

BlogsSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
//        delete json.status;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

BlogsSchema.plugin(idvalidator)
BlogsSchema.plugin(timestamps)

BlogsSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("Blogs", BlogsSchema);
