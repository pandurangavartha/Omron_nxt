'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var reminderSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    product_name: {
        type: String,
        required: 'Product name is missing.',
        unique: false
    },
    user_id: {
        type: String,
        required: 'User id is missing',
        unique: false
    },
    reminder_category_name: {
        type: String,
        required: 'Select reminder Category - Morning/Afternoon/Night',
        unique: false
    },
    reminder_category_time: {
        type: String,
        required: 'Select time of the day',
        unique: false
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

    reminderSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

reminderSchema.plugin(timestamps)
reminderSchema.plugin(idvalidator)

reminderSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("reminders", reminderSchema);
