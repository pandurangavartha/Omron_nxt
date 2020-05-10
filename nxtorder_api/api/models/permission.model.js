'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var PermissionSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    resourcePath: {
        type: String,
        required: "Resource path is missing."
    },
    resourceName: {
        type: String,
        required: 'Resource name is missing.',
        unique: true
    },
    method: {
        type: String,
        required: 'Method is missing.'
    }
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

PermissionSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

PermissionSchema.plugin(timestamps)
PermissionSchema.plugin(idvalidator)

module.exports = mongoose.model('Permission', PermissionSchema);
