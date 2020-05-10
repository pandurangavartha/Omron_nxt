'use strict'

const timestamps = require('mongoose-timestamp');
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var IndustrySchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    industryName: {
        type: String,
        required: "Industry name is missing.",
        unique: true
    },
    code: {
        type: String,
        unique: true
    },
    banners: [{
            banner: String
        }],
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
IndustrySchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};
IndustrySchema.plugin(timestamps);
IndustrySchema.plugin(idvalidator);

IndustrySchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("Industry", IndustrySchema);
