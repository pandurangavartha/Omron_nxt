const Promise = require('bluebird');

const Permission = require('../models/permission.model');
const Msg = require('../../config/strings');

exports.create = function (permissionObj) {
    return Permission.findOne({
        permissionName: permissionObj.permissionName
    }).exec()
        .then(function (permission) {
            if (permission) {
                var err = new Error(Msg.STORE_EXISTS);
                err.status = 409;
                return Promise.reject(err);
            }
            return Permission.create(permissionObj)
                .then(function (permission) {
                    return Promise.resolve(permission);;
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

exports.update = function (permission, permissionId) {
    return Permission.findByIdAndUpdate(permissionId, permission, {
        new: true,
        runValidators: true
    });
};

exports.view = function (permissionId) {
    return Permission.findById(permissionId);
};

exports.delete = function (permissionId) {
    return Permission.findByIdAndUpdate(permissionId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};

exports.getAll = function () {
    return Permission.find({ deleted: { $exists: false } }).then(function (data) {
        return Promise.resolve(data);
    });
};