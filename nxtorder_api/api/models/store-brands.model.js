'use strict'

const timestamps = require('mongoose-timestamp');
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var StoreBrandsSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    brandName: {
        type: String,
//        required: "Brand name is missing.",
//        unique: true
    },
    logo: {
        type: String,
//        unique: true
    },
//    banners: [{
//            banner: String
//        }],
    status: {
        type: String,
        required: true,
        enum: ["Active", "InActive", "Pending Approval", "Approved"],
        default: 'Active'
    },
    deleted: Boolean,
    ownerId: {
        type: String,
        ref: "User",
        required: 'User _id is missing.'
    },
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
StoreBrandsSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};
StoreBrandsSchema.plugin(timestamps);
StoreBrandsSchema.plugin(idvalidator);

StoreBrandsSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("StoreBrands", StoreBrandsSchema);
