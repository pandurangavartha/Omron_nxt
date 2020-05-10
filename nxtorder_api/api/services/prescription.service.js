const Promise = require('bluebird');

const Prescription = require('../models/prescription.model');
const Msg = require('../../config/strings');
const mongoose = require('mongoose');
const _ = require('lodash');
const User = require('../models/user.model');

exports.create = function (prescriptionObj) {
    return User.findById(prescriptionObj.user)
            .then(function (user) {
                var user = {
                    "_id": user.id,
                    "name": user.firstName,
                    "username": user.username
                }
                prescriptionObj.user = user;
                return Prescription.create(prescriptionObj)
                        .then(function (prescription) {
                            return Promise.resolve(prescription);
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
            })
};

exports.update = function (prescription, prescriptionId) {
    return Prescription.findByIdAndUpdate(prescriptionId, prescription, {
        new : true,
        runValidators: true
    });
};
exports.view = function (prescriptionId) {
    return Prescription.findById(prescriptionId);
};

exports.delete = function (prescriptionId) {
    return Prescription.findByIdAndUpdate(prescriptionId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};

exports.getAll = function (req) {
    var query = {
        deleted: {$exists: false},
        status: "Active"
    }
    if (req.user_id) {
        query['user._id'] = req.user_id
    }
    return Prescription.find(query).then(function (data) {
        return Promise.resolve(data);
    });
};