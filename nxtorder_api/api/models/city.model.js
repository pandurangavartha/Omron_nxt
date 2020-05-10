'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var CitySchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    name: {
        type: String,
        required: 'City name is missing.',
        unique: true
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

CitySchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

CitySchema.plugin(timestamps)
CitySchema.plugin(idvalidator)

CitySchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("City", CitySchema);
