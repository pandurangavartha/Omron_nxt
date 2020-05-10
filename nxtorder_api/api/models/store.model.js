'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var StoreSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    storeName: {
        type: String,
        required: 'Store name is missing.',
//        unique: true
    },
    branchName: {
        type: String,
        required: 'Branch name is missing.',
    },
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        country: String,
        zipcode: String
    },
    location: {
        type: [Number],
        required: 'Location is missing.'
    },
    status: {
        type: String,
        enum: ["Active", "InActive", "Pending Approval"],
        default: 'Pending Approval'
    },
    logo: String,
    gstin: String,
    openingHours: [String],
    workingDays: [String],
    storeMobile: {
        type: String,
        required: 'Store Mobile Number is missing.'
    },
    storeLandline: {
        type: String,
        required: 'Store Landline Number is missing.'
    },
    companyEmail: {
        type: String,
//        required: 'Email Landline Number is missing.'
    },
    type: {
        type: String,
//        required: 'Email Landline Number is missing.'
    },
    owner: {
        type: String,
        ref: "User",
        required: 'Owner _id is missing.'
    },
    industry: {
        _id: {
            type: String,
            ref: "Industry",
            required: 'Industry _id is missing.'
        },
        industryName: String
    },
    isFavourite: {type: Boolean, default: false},
    storeBrand: {type: String,
        ref: "StoreBrands",
//        required: 'Category _id is missing.'
    },
    brands: [{
            _id: {type: String, ref: "Brand"},
//        resourcePath: String,
//        name: String,
//        method: String
        }],
    employees: [{
            _id: {
                type: String,
                ref: "User",
                required: 'Employee _id is missing.'
            },
            name: {type: String, required: 'Employee name is missing.'},
            username: {type: String, required: 'Employee username is missing.'}
        }],
    isBulkOrdersAccept: {type: Boolean, default: false},
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

StoreSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

StoreSchema.plugin(timestamps)
StoreSchema.plugin(idvalidator)

StoreSchema.set('toObject', {getters: true, virtuals: true});

StoreSchema.index({location: '2dsphere'});

module.exports = mongoose.model("Store", StoreSchema);