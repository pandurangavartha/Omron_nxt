const PermissionService = require('../services/permission.service');

exports.register = function (req, res, next) {
    var permissionObj = req.body

    PermissionService.create(permissionObj).then(function (permission) {
        return res.send({ result: permission });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.update = function (req, res, next) {
    var permission = req.body
    PermissionService.update(permission, req.params.permission_id)
        .then(function (permission) {
            return res.send({ result: permission });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.view = function (req, res, next) {
    PermissionService.view(req.params.permission_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.delete = function (req, res, next) {
    PermissionService.delete(req.params.permission_id).then(function (permission) {
        return res.send({ result: permission });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.all = function (req, res, next) {
    PermissionService.getAll().then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
}