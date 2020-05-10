'use strict'

/** External modules **/
const timestamps = require('mongoose-timestamp');
const mongoose = require("mongoose");
const shortid = require('shortid');
const idvalidator = require('mongoose-id-validator');
const Schema = mongoose.Schema;

var ExpenseSchema = new Schema({
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
    expenseType: {
        type: String,
        required: 'Expense Type is missing'
    },
    recieptNo: {
        type: String,
        required: 'Reciept Number is missing'
    },
    procurementId: {
        type: String,
        ref: "Procurement",
    },
    amount: {
        type: String,
        required: 'Amount is missing.'
    },
    note: {
        type: String,
        required: 'Notes is missing.'
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

ExpenseSchema.methods = {

    responseJSON: function () {
        var json = this.toJSON();
        delete json.deleted;
        delete json.createdAt;
        delete json.updatedAt;
        return json;
    }
};

ExpenseSchema.plugin(timestamps)
ExpenseSchema.plugin(idvalidator);

ExpenseSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model("expense", ExpenseSchema);
