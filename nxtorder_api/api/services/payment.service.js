const Promise = require('bluebird')
const Payment = require('../models/payment.model');
const Msg = require('../../config/strings');


exports.create = function (paymentObj) {
    return Payment.create(paymentObj)
        .then(function (payment) {
            return payment;
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

exports.update = function (payment, paymentId) {
    return Payment.findByIdAndUpdate(paymentId, payment, {
        new: true,
        runValidators: true
    });
};

exports.view = function (paymentId) {
    return Payment.findById(paymentId).exec();
};

exports.delete = function (paymentId) {
    return Payment.findByIdAndUpdate(paymentId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};

exports.getAll = function (storeId) {
    return Payment.find({ deleted: { $exists: false }, "store._id": storeId  }).exec();
};