'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var RoleSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    roleName: {
        type: String,
        required: 'Role name is missing.',
        unique: true
    },
    permissions: [{
        _id: { type: String, ref: "Permission" },
        resourcePath: String,
        resourceName: String,
        method: String
    }],
    inherits: [{
        type: String, ref: "Role"
    }],
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

RoleSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

RoleSchema.plugin(timestamps)
RoleSchema.plugin(idvalidator)

RoleSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("Role", RoleSchema);
