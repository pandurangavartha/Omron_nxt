const CallService = require('../services/calls.service');
const moment = require('moment');
exports.register = function (req, res, next) {
    var callObj = req.body;
    callObj.user = req.user;
    console.log(callObj, 'callObj')
    CallService.create(callObj).then(function (calls) {
        return res.send({result: calls});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
exports.view = function (req, res, next) {
    CallService.view(req.params.id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
exports.getAllCalls = function (req, res, next) {
    CallService.getItemsAll(req.params.user_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}