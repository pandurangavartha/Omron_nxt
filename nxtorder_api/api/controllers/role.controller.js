const RoleService = require('../services/role.service');
const Msg = require('../../config/strings');

exports.register = function (req, res, next) {
    var roleObj = req.body

    RoleService.create(roleObj).then(function (role) {
        return res.send({ result: role });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.addPermissions = function (req, res, next) {
    var permissions = req.body.permissions

    RoleService.addPermissions(permissions, req.params.role_id).then(function (permissionObj) {
        if (permissionObj) {
            return res.status(200).send({ result: permissionObj })
        } else {
            return res.status(400).send({ result: { error: Msg.STORE_NOT_EXISTS } })
        }

    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    })
};

exports.removePermissions = function (req, res, next) {
    var permissions = req.body.permissions

    RoleService.removePermissions(permissions, req.params.role_id)
        .then(function (permissionObj) {
            if (permissionObj) {
                return res.status(200).send({ result: permissionObj })
            } else {
                return res.status(400).send({ result: { error: Msg.ROLE_NOT_EXISTS } })
            }

        }).catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.update = function (req, res, next) {
    var role = req.body
    delete role.permissions;

    RoleService.update(role, req.params.role_id)
        .then(function (role) {
            return res.send({ result: role });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.delete = function (req, res, next) {
    RoleService.delete(req.params.role_id).then(function (role) {
        return res.send({ result: role });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.view = function (req, res, next) {
    RoleService.view(req.params.role_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.getAll = function (req, res, next) {
    RoleService.getAll().then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};