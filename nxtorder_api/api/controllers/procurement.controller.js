const OrderService = require('../services/order.service');

exports.register = function (req, res, next) {
    var procurementObj = req.body
    procurementObj.status = "Open"
    procurementObj.orderType = "Procurement"
    procurementObj.user = req.user
    OrderService.create(procurementObj, req.params.store_id)
        .then(function (procurement) {
            return res.send({ result: procurement });
        }).catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        });
};

exports.update = function (req, res, next) {
    var procurement = req.body
    delete procurement.store;
    OrderService.update(procurement, req.params.procurement_id)
        .then(function (procurement) {
            return res.send({ result: procurement });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.view = function (req, res, next) {
    OrderService.view(req.params.id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.delete = function (req, res, next) {
    OrderService.delete(req.params.id).then(function (procurement) {
        return res.send({ result: procurement });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.all = function (req, res, next) {
    var query = req.query
    query["orderType"] = "Procurement"
    OrderService.getAll(req.params.store_id, query).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
}