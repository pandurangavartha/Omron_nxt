'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

var PrivacySchema = new Schema({

    _id: {
        type: String,
        default: shortid.generate
    },
    title: {
        type: String,
        required: 'Title is missing.'
    },
    
//    image: {
//        type: String,
//        required: 'Title is missing.'
//    },
    htmlBody: {
        type: String,
        required: 'Body is missing.'
    },
   type: {
        type: String,
        required: 'Type is missing.',
        enum: ["Terms", "Privacy", "Return"]
    },
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

PrivacySchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
//        delete json.status;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

PrivacySchema.plugin(idvalidator)
PrivacySchema.plugin(timestamps)

PrivacySchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("Privacy", PrivacySchema);
