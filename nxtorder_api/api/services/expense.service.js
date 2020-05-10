const Promise = require('bluebird');

const Expense = require('../models/expense.model');
const Store = require('../models/store.model');
const Msg = require('../../config/strings');
const moment = require('moment')

exports.create = function (expenseObj, storeId) {

    return Store.findById(storeId)
        .then(function (store) {
            var storeObj = {}
            storeObj._id = store._id
            storeObj.storeName = store.storeName

            expenseObj.store = storeObj

            return Expense.create(expenseObj)
        }).catch(function (err) {
            if (err.name === 'ValidationError') {
                var err1 = new Error(err.message);
                err1.status = 400;
                return Promise.reject(err1);
            }
            var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
            err2.status = 500;
            return Promise.reject(err2);
        });
};

exports.update = function (expense, expenseId) {
    return Expense.findByIdAndUpdate(expenseId, expense, {
        new: true,
        runValidators: true
    });
};

exports.view = function (expenseId) {
    return Expense.findById(expenseId);
};

exports.delete = function (expenseId) {
    return Expense.findByIdAndUpdate(expenseId, { deleted: true }, { new: true, runValidators: true });
};

exports.getAll = function (storeId, reqQuery) {

    var query = { deleted: { $exists: false } }

    query['store._id'] = storeId

    if (reqQuery.reciept_no) {
        query['recieptNo'] = reqQuery.reciept_no
    }

    if (reqQuery.expense_type) {
        query['expenseType'] = reqQuery.expense_type
    }

    if (reqQuery.end_date && reqQuery.start_date) {
        query.createdAt = { $lte: moment.utc(reqQuery.end_date).endOf('day').toDate(), $gte: moment.utc(reqQuery.start_date).startOf('day').toDate() };
    } else {
        if (reqQuery.start_date) {
            query.createdAt = { $gte: moment.utc(reqQuery.start_date).startOf('day').toDate() };
        }
        if (reqQuery.end_date) {
            query.createdAt = { $lte: moment.utc(reqQuery.end_date).endOf('day').toDate() };
        }
    }

    return Expense.find(query);

};