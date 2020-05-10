'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var OfferSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    store: {
        _id: {
            type: String,
            ref: "Store",
            required: 'Store _id is missing.'
        },
        storeName: String
    },
    industry: {
        _id: {
            type: String,
            ref: "Industry",
            required: 'Industry _id is missing.'
        },
        industryName: String
    },
    addedBy: {
        _id: {
            type: String,
            ref: "User",
            required: 'User _id is missing.'
        },
        name: String,
        username: String
    },
    offerCriteria: [{
            type: String,
            enum: ["Product", "Product Variant", "User", "Bill Amount", "Credit Card", "Debit Card", "Net Banking", "Wallets", "Coupon Code"],
            required: 'Offer criteria is missing.'
        }],
    offerType: {
        type: String,
        enum: ["Flat_Discount", "Discount_Percent", "Cash_Back", "Flash_Sale", "Special_Offer","Banner_Offer"],
        required: 'Offer type is missing.'
    },
    status: {
        type: String,
        enum: ["Approved", "InActive"],
//        default: ['Approved']
//        required: 'Offer status is missing.'
    },
    bannerImage: String,
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
    category: {
        _id: {
            type: String,
            ref: "StoreCategory"
        },
        categoryName: String
    },
    user: {
        _id: {
            type: String,
            ref: "User"
        },
        name: String,
        username: String
    },
    startDate: Date,
    endDate: Date,
    salePrice: Number,
    minQuantity: {
        type: String,
        default: null
    },
    discount:String,
    bankName: String,
    walletName: String,
    couponCode: String,
    description: String,
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

OfferSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

OfferSchema.plugin(timestamps);
OfferSchema.plugin(idvalidator);

OfferSchema.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model("Offer", OfferSchema);
