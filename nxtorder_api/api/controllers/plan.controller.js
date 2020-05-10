const PlanService = require('../services/plan.service');
const Msg = require('../../config/strings');

exports.register = function (req, res, next) {
    var planObj = req.body
    PlanService.create(planObj).then(function (role) {
        return res.send({ result: role });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};


exports.update = function (req, res, next) {
    var plan = req.body
    PlanService.update(plan, req.params.plan_id)
        .then(function (role) {
            return res.send({ result: role });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.delete = function (req, res, next) {
    PlanService.delete(req.params.plan_id).then(function (role) {
        return res.send({ result: role });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.view = function (req, res, next) {
    PlanService.view(req.params.plan_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.getAll = function (req, res, next) {
    PlanService.getAll().then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
exports.planActivate = function (req, res, next) {
    PlanService.planActivate(req.body.plan_id, req.body.status).then(function (plan) {
        if (plan) {
            return res.send({result: plan})
        } else {
            return res.status(400).send({result: {error: Msg.PLAN_NOT_EXISTS}})
        }
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};