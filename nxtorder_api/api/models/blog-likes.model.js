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

var BlogsLikesSchema = new Schema({

    _id: {
        type: String,
        default: shortid.generate
    },
    blogs: {
        _id: {
            type: String,
            ref: "Blogs",
            required: 'Blogs _id is missing.'
        },
//        storeName: String
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
//        required: 'Offer type is missing.'
    },
    
    user: {
        _id: {
            type: String,
            ref: "User"
        },
        name: String,
        username: String
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

BlogsLikesSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

BlogsLikesSchema.plugin(timestamps);
BlogsLikesSchema.plugin(idvalidator);

BlogsLikesSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("BlogsLikes", BlogsLikesSchema);


