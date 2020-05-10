'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var PlanSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    planName: {
        type: String,
        required: 'Plan name is missing.',
        unique: true
    },
    planDescription: {
        type: String,
    },
    planValidity: {
        type: String,
        required: 'Plan validity is missing.',
        unique: true
    },
    planPrice: {
        type: Number,
        required: 'Plan price is missing.',
        unique: true
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
    isActive: {
        type: Boolean,
        default: true,
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

PlanSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

PlanSchema.plugin(timestamps)
PlanSchema.plugin(idvalidator)

PlanSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("Plan", PlanSchema);
