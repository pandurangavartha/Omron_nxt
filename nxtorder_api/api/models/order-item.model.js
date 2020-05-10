'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp')
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var OrderItemSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    product: {
        _id: {
            type: String,
            ref: "StoreProduct",
            required: 'Product _id is missing.'
        },
        productName: String,
        images: [String],
        shortCode: String,
        baseRetailPrice: Number,
        baseTaxPercent: Number
    },
    variant: {
        _id: String,
        variantName: String,
        variantRetailPrice: Number,
        variantTaxPercent: Number,
        features: [String],
        images: [String]
    },
    price: {
        type: Number,
        required: 'Price is missing.',
        
    },
    quantity: {
        type: Number,
        required: 'Quantity is missing.'
    },
    taxPercent: {
        type: Number,
        required: 'Tax Percent is missing.'
    },
    deleted: Boolean,
    industryId: { type: String, ref: "Industry",required: 'Industry _id is missing.'
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

OrderItemSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

OrderItemSchema.plugin(timestamps)
OrderItemSchema.plugin(idvalidator)

OrderItemSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("OrderItem", OrderItemSchema);
