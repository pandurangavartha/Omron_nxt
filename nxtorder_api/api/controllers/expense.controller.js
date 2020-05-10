const ExpenseService = require('../services/expense.service');
const Msg = require('../../config/strings');

exports.register = function (req, res, next) {
    var expenseObj = {}
    expenseObj.expenseType = req.body.expenseType
    expenseObj.recieptNo = req.body.recieptNo
    expenseObj.amount = req.body.amount
    expenseObj.note = req.body.note

    ExpenseService.create(expenseObj, req.params.store_id).then(function (expense) {
        return res.send({ result: expense });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.update = function (req, res, next) {
    var offer = req.body

    delete offer.store;
    
    ExpenseService.update(offer, req.params.expense_id)
        .then(function (offer) {
            return res.send({ result: offer });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.view = function (req, res, next) {
    ExpenseService.view(req.params.expense_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.delete = function (req, res, next) {
    ExpenseService.delete(req.params.expense_id).then(function (offer) {
        return res.send({ result: offer });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.all = function (req, res, next) {
    ExpenseService.getAll(req.params.store_id, req.query).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};