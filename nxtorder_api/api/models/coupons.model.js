/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var CouponSchema = new Schema({

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
        storeName: String
    },
//    addedBy: {
//        _id: {
//            type: String,
//            ref: "User",
//            required: 'User _id is missing.'
//        },
//        name: String,
//        username: String
//    },
//    offerCriteria: [{
//        type: String,
//        enum: ["Product", "Product Variant", "User", "Bill Amount", "Credit Card", "Debit Card", "Net Banking", "Wallets", "Coupon Code"],
//        required: 'Offer criteria is missing.'
//    }],
    couponStatus: {
        type: String,
        enum: ["Approved", "Process","Expired"],
//        required: 'Offer type is missing.'
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
//        required: 'Offer type is missing.'
    },
     description: {
        type: String,
//        enum: ["Active", "Inactive"],
//        required: 'Offer type is missing.'
    },
    couponType: {
      type:String,
      enum:["Overall","Individual"]
    },
    logo: String,
//    product: {
//        _id: {
//            type: String,
//            ref: "Product",
//            required: 'Product _id is missing.'
//        },
//        productName: String,
//        shortCode: String,
//        baseRetailPrice: Number,
//        baseTaxPercent: Number
//    },
//    variant: {
//        _id: String,
//        variantName: String,
//        variantRetailPrice: Number,
//        variantTaxPercent: Number,
//        features: [String],
//        images: [String]
//    },
//    category: {
//        _id: {
//            type: String,
//            ref: "ProductCategory"
//        },
//        categoryName: String
//    },
    user: {
        _id: {
            type: String,
            ref: "User"
        },
        name: String,
        username: String
    },
    termsAndConditions:{
        type: String,
//        enum: ["Active", "Inactive"],
//        required: 'Offer type is missing.'
    },
//    bankName: String,
//    walletName: String,
    couponCode: String,
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

CouponSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

CouponSchema.plugin(timestamps);
CouponSchema.plugin(idvalidator);

CouponSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("Coupon", CouponSchema);


