const Promise = require('bluebird');

const City = require('../models/city.model');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.create = function (cityObj) {
    return City.findOne({
        roleName: cityObj.name,
        deleted: false
    }).exec()
        .then(function (city) {
            if (city) {
                const msg = "City name already exists."
//                var err = new Error(Msg.ROLE_EXISTS);
                var err = new Error(msg);
                err.status = 409;
                return Promise.reject(err);
            }
            return City.create(cityObj)
                .then(function (role) {
                    return Promise.resolve(role);;
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

exports.removePermissions = function (permissionsObj, roleId) {
    return Role.findById(roleId).exec().then(function (roleObj) {
        var list = [];
        if (roleObj.permissions) {
            list = _.pull(roleObj.permissions, permissionsObj)
        } else {
            var err2 = new Error(Msg.ROLE_NOT_EXISTS);
            err2.status = 204;
            return Promise.reject(err2);
        }

        return Role.findByIdAndUpdate(roleId, { $pull: { permissions: { $in: permissionsObj } } }, {
            new: true,
            runValidators: true
        });

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

exports.update = function (city, cityId) {
    return City.findByIdAndUpdate(cityId, city, {
        new: true,
        runValidators: true
    });
};

exports.view = function (cityId) {
    return City.findById(cityId);
};

exports.delete = function (cityId) {
    return City.findByIdAndUpdate(cityId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};

exports.getAll = function () {
    return City.find({ deleted: { $exists: false } }).then(function (data) {
        return Promise.resolve(data);
    });
};