'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const crypto = require('crypto');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var NeedHelpSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    topicname: {
        type: String,
        unique: true,
        required: 'name is missing.'
    },

    topicissues: [{
            _id: {
                type: String,
                default: shortid.generate
            },
            name: String,
            description: String
        }],

    status: {
        type: String,
        required: true,
        enum: ["Active", "InActive", "Pending Approval"],
        default: 'Active'
    },
    industry: {
        _id: {
            type: String,
            ref: "Industry",
            required: 'Industry _id is missing.'
        },
//        industryName: String
    },
    deleted: Boolean
}, {
    toJSON: {
        transform: function (doc, ret, options) {
            delete ret.__v;
            delete ret.deleted;
            delete ret.lastLogin;
            delete ret.otp;
        }
    }
});


NeedHelpSchema.methods = {
    responseJSON: function () {
        var json = this.toJSON();
        delete json.lastLogin;
        delete json.deleted;
        return json;
    }
};

NeedHelpSchema.plugin(timestamps);
NeedHelpSchema.plugin(idvalidator)

NeedHelpSchema.set('toObject', {getters: true, virtuals: true});

NeedHelpSchema.index({currentPosition: '2dsphere'});

module.exports = mongoose.model('Needhelp', NeedHelpSchema);