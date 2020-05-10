'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const crypto = require('crypto');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    username: {
        type: String,
        unique: true,
//        required: 'Username is missing.'
    },
    mobile: {
        type: String,
        unique: true,
        required: 'Mobile is missing.'
    },
    secondaryMobile: {
        type: String,
//        unique: true,
//        required: 'Username is missing.'
    },
    firstName: {
        type: String,
//        required: 'First name is missing.'
    },
    lastName: {
        type: String,
//        required: 'Last name is missing.'
    },
    gender: {
        type: String,
//        required: 'Gender name is missing.'
    },
    languagesSpoken: [{
            type: String,
//        required: 'Last name is missing.'
        }],
    qrCode: {
        type: String,
//        required: 'Last name is missing.'
    },
    qrCodeImage: {
        type: String,
//        required: 'Last name is missing.'
    },
    prefferedLanguage: {
        type: String,
//        required: 'Last name is missing.'
    },
    basicPercentage: {
        type: Number,
        default: 40
    },
    customerRating: {
        type: Number,
//        default: 
    },
    comment: {
        type: String,
//        default: 40
    },
    customerReview: {
        type: String,
//        default: 40
    },

    addressPercentage: {
        type: Number,
        default: 30
    },
    interestsPercentage: {
        type: Number,
        default: 30
    },
    profilePercentage: {
        type: Number,
        default: 0
    },
    profilePicture: String,
    addresses: [{
            line1: String,
            line2: String,
            city: String,
            state: String,
            country: String,
            zipcode: String,
            addressType: String
        }],
    hashed_password: String,
    salt: String,
    accessToken: String,
    refreshToken: String,
    status: {
        type: String,
        required: true,
        enum: ["Active", "InActive", "Pending Approval"],
        default: 'Active'
    },
    store: {
        _id: {
            type: String,
            ref: "Store"
        },
        storeName: String
    },
    interests: [{
            _id: {
                type: String,
                ref: "Industry"
            },
            industryName: String,
            code: String
        }],
    lastLogin: Date,
    userMeta: {},
    roles: {
        type: [String],
        required: true
    },
    otp: {
        type: String,
        default: 4545
    },
    deviceTokens: {
        android: [],
        ios: []
    },
    currentPosition: {
        type: [Number]
    },
    vendorStatus: {type: String,
        required: true,
        enum: ["Partial", "Completed"],
        default: 'Partial'
    },
    deleted: Boolean
}, {
    toJSON: {
        transform: function (doc, ret, options) {
            delete ret.__v;
            delete ret.deleted;
            delete ret.deviceTokens;
            delete ret.hashed_password;
            delete ret.salt;
            delete ret.userMeta;
            delete ret.lastLogin;
            delete ret.otp;
        }
    }
});

UserSchema.virtual('name').get(function () {
    return this.firstName + ' ' + this.lastName;
});

UserSchema.virtual('password').set(function (password) {
    this._password = String(password);
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(this._password);
}).get(function () {
    return this._password;
});

UserSchema.methods = {
    createToken: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },
    encryptPassword: function (password) {
        if (!password || !this.salt)
            return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    },
    responseJSON: function () {
        var json = this.toJSON();
        delete json.deviceTokens;
        delete json.hashed_password;
        delete json.salt;
        delete json.userMeta;
        delete json.lastLogin;
        delete json.deleted;
        delete json.otp;
        return json;
    }
};

UserSchema.plugin(timestamps);
UserSchema.plugin(idvalidator)

UserSchema.set('toObject', {getters: true, virtuals: true});

UserSchema.index({currentPosition: '2dsphere'});

module.exports = mongoose.model('User', UserSchema);