const ReportService = require('../services/report.service');
const Order = require('../models/order.model');
const Msg = require('../../config/strings');
const moment = require('moment')
const _ = require('lodash');

exports.sales = function (req, res, next) {

    var storeId = req.params.store_id
    var query = req.query

    if (!moment(query.from, "MM/DD/YYYY", true).isValid() && !moment(query.to, "MM/DD/YYYY", true).isValid()) {
        return res.status(400).send({ result: { error: "Missing or Invalid From and To dates. Input is expected to be in the MM/DD/YYYY format." } })
    }

    ReportService.sales(storeId, query.from, query.to)
        .then(function (data) {
            return res.send({ result: data });
        }).catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        });
};

exports.taxCollected = function (req, res, next) {
    var storeId = req.params.store_id
    var query = req.query

    if (!moment(query.from, "MM/DD/YYYY", true).isValid() && !moment(query.to, "MM/DD/YYYY", true).isValid()) {
        return res.status(400).send({ result: { error: "Missing or Invalid From and To dates. Input is expected to be in the MM/DD/YYYY format." } })
    }

    ReportService.taxCollected(storeId, query.from, query.to)
        .then(function (data) {
            return res.send({ result: data });
        }).catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        });

};

exports.soldProducts = function (req, res, next) {
    var storeId = req.params.store_id
    var query = req.query

    if (!moment(query.from, "MM/DD/YYYY", true).isValid() && !moment(query.to, "MM/DD/YYYY", true).isValid()) {
        return res.status(400).send({ result: { error: "Missing or Invalid From and To dates. Input is expected to be in the MM/DD/YYYY format." } })
    }

    ReportService.soldProducts(storeId, query.from, query.to)
        .then(function (data) {
            return res.send({ result: data });
        }).catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        });

};