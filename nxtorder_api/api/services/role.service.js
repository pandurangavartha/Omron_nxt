const Promise = require('bluebird');

const Role = require('../models/role.model');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.create = function (roleObj) {
    return Role.findOne({
        roleName: roleObj.roleName,
        deleted: false
    }).exec()
        .then(function (role) {
            if (role) {
                var err = new Error(Msg.ROLE_EXISTS);
                err.status = 409;
                return Promise.reject(err);
            }
            return Role.create(roleObj)
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

exports.addPermissions = function (permissionsObj, roleId) {
    return Role.findById(roleId).exec().then(function (roleObj) {

        if (roleObj) {
            var list = [];
            if (roleObj.permissions && roleObj.permissions.length > 0) {
                list = _.concat(roleObj.permissions, permissionsObj)
            } else {
                list = permissionsObj
            }

            return Role.findByIdAndUpdate(roleId, { $push: { permissions: { $each: permissionsObj } } }, {
                new: true,
                runValidators: true
            });
        } else {
            var err = new Error(Msg.ROLE_NOT_EXISTS);
            err.status = 204;
            return Promise.reject(err);
        }

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

exports.update = function (role, roleId) {
    return Role.findByIdAndUpdate(roleId, role, {
        new: true,
        runValidators: true
    });
};

exports.view = function (roleId) {
    return Role.findById(roleId);
};

exports.delete = function (roleId) {
    return Role.findByIdAndUpdate(roleId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};

exports.getAll = function () {
    return Role.find({ deleted: { $exists: false } }).then(function (data) {
        return Promise.resolve(data);
    });
};