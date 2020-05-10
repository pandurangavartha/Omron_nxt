'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var PaymentSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    paymentType: {
        type: String,
        enum: ["Cash On Delivery", "Online"],
        required: 'Payment Type is missing.'
    },
    paymentGW: String,
    referenceId: String,
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

PaymentSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

PaymentSchema.plugin(timestamps);
PaymentSchema.plugin(idvalidator);

PaymentSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("Payment", PaymentSchema);
