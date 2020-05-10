'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

var PrescriptionSchema = new Schema({

    _id: {
        type: String,
        default: shortid.generate
    },
    title: {
        type: String,
        required: 'Name is missing.'
    },
    prescriptionDate: Date,
    comments: {
        type: String,
        required: 'Comments is missing.'
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "InActive"],
        default: "Active"
    },
    user: {
        _id: {
            type: String,
            ref: "User"
        },
        name: String,
        username: String
    },
//     logo: String,
    images: [],
    deleted: Boolean

}, {
    toJSON: {
        transform: function (doc, ret, options) {
            delete ret.__v;
            delete ret.statusl
            delete ret.deleted;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    }
});

PrescriptionSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.status;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

PrescriptionSchema.plugin(idvalidator)
PrescriptionSchema.plugin(timestamps)

PrescriptionSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
