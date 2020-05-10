const CityService = require('../services/city.service');
const Msg = require('../../config/strings');

exports.register = function (req, res, next) {
    var cityObj = req.body
    console.log("in cityyyyyyyyyyyyys")
    CityService.create(cityObj).then(function (city) {
        return res.send({ result: city });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.update = function (req, res, next) {
    var city = req.body

    CityService.update(city, req.params.city_id)
        .then(function (role) {
            return res.send({ result: city });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.delete = function (req, res, next) {
    CityService.delete(req.params.city_id).then(function (city) {
        return res.send({ result: city });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.view = function (req, res, next) {
    CityService.view(req.params.city_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.all = function (req, res, next) {
    CityService.getAll().then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};