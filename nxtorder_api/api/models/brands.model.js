'use strict'

const timestamps = require('mongoose-timestamp');
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var BrandSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    name: {
        type: String,
        required: "Industry name is missing.",
        unique: true
    },
    brandLogo: {type: String},
    status: {
        type: String,
        required: true,
        enum: ["Active", "InActive", "Pending Approval"],
        default: 'Active'
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
BrandSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};
BrandSchema.plugin(timestamps);
BrandSchema.plugin(idvalidator);

BrandSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("Brand", BrandSchema);
