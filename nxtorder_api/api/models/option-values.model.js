'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

var OptionValuesSchema = new Schema({

    _id: {
        type: String,
        default: shortid.generate
    },
    value: {
        type: String,
        required: 'Title is missing.'
    },
    type: {
//        _id: {
        type: String,
        ref: "OptionType",
        required: 'Option type is missing.'
//        },
//        categoryName: {type: String, required: 'Category name is missing.'},
    },
//    image: {
//        type: String,
//        required: 'Title is missing.'
//    },
    
//    image: String,
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

OptionValuesSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
//        delete json.status;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

OptionValuesSchema.plugin(idvalidator)
OptionValuesSchema.plugin(timestamps)

OptionValuesSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("OptionValues", OptionValuesSchema);
