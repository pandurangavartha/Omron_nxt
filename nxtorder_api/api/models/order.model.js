'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp')
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;
console.log("in ordets")
var OrderSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    status: {
        type: String,
        required: 'Status is missing.',
        enum: ["Open", "Placed", "Delivered", "Cancelled", "Closed"]
    },
    store: {
        _id: {
            type: String,
            ref: "Store",
            required: 'Store _id is missing.'
        },
        storeName: String
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
    orderType: {
        type: String,
        required: 'Order Type is missing.',
        enum: ["Procurement", "Store Front", "Online"]
    },
    procurementId: {
        type: String,
        ref: "Procurement"
    },
    orderItems: [
        {
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
                required: 'Price is missing.'
            },
            quantity: {
                type: Number,
                required: 'Quantity is missing.'
            },
            taxPercent: {
                type: Number,
                required: 'Tax Percent is missing.'
            }
        }
    ],
    billedItems: {
        type: Array,
        items: {
            type: String,
            ref: "ProductInventory"
        },
        required: 'Billed Items are missing.'
    },
    shippingAddress: {
        city:String,
        country: String,
        state: String,
        zipcode: String,
        line2: String,
        line1: String,
    },
    billAmount: {
        type: Number,
        required: 'Bill amount is missing.',
        default: 0
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    taxAmount: {
        type: Number,
        required: 'Tax amount is missing.',
        default: 0
    },
    totalAmount: {
        type: Number,
        required: 'Total amount is missing.',
        default: 0
    },
    industryId: { type: String, ref: "Industry",
            required: 'Industry _id is missing.' // newly added for grocerry
    },
    paymentDetails: {
        paymentType: {
            type: String,
            enum: ["Cash On Delivery", "Online"]
        },
        paymentGW: String,
        referenceId: String
    },
    deliveryETA: Date,
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

OrderSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

OrderSchema.plugin(timestamps);
OrderSchema.plugin(idvalidator);

OrderSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("Order", OrderSchema);
