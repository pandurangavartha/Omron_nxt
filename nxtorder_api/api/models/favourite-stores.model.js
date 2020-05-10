'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var FavouriteStoresSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    industry: {
        _id: {
            type: String,
            ref: "Industry",
            required: 'industry_id is missing.'
        },
        industryName: String
    },
    store: {
        _id: {
            type: String,
            ref: "Store",
            required: 'Store _id is missing.'
        },
        storeName: String,
        logo: String
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

FavouriteStoresSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

FavouriteStoresSchema.plugin(timestamps);
FavouriteStoresSchema.plugin(idvalidator);

FavouriteStoresSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("FavouriteStores", FavouriteStoresSchema);
