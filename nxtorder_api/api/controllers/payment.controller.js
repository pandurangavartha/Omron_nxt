const PaymentService = require('../services/payment.service');

exports.register = function (req, res, next) {
    var paymentObj = req.body

    PaymentService.create(paymentObj).then(function (payment) {
        return res.send({ result: payment });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.update = function (req, res, next) {
    var payment = req.body
    PaymentService.update(payment, req.params.payment_id)
        .then(function (payment) {
            return res.send({ result: payment });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.view = function (req, res, next) {
    PaymentService.view(req.params.payment_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.delete = function (req, res, next) {
    PaymentService.delete(req.params.payment_id).then(function (payment) {
        return res.send({ result: payment });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.all = function (req, res, next) {
    PaymentService.getAll(req.params.store_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
}