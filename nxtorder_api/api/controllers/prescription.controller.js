const PrescriptionService = require('../services/prescription.service');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.register = function (req, res, next) {
    var prescriptionObj = req.body;
    console.log(req.files, prescriptionObj, "fileeeeeeeeeeeee")
    var banners = []
    if (req.files) {
        _.each(req.files, function (obj) {
//            var object = {
//                banner: obj.path
//            }
            var path = obj.destination + '/' + obj.filename;
            banners.push(path)

        })
        prescriptionObj.images = banners
    }
    PrescriptionService.create(prescriptionObj).then(function (prescription) {
        if (prescription) {
            return res.send({result: prescription});
        } else {
            return res.status(400).send({result: {error: Msg.INDUSTRY_CREATION_FAILED}})
        }
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}
exports.update = function (req, res, next) {
    var prescription = req.body;
    var banners = [];
    if (req.files) {
        _.each(req.files, function (obj) {
            var path = obj.destination + '/' + obj.filename;
            banners.push(path);
//            banners.push(object)

        })
        prescription.images = banners
    }
    PrescriptionService.update(prescription, req.params.prescription_id)
            .then(function (prescription) {
                return res.send({result: prescription});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.view = function (req, res, next) {
    PrescriptionService.view(req.params.prescription_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
exports.delete = function (req, res, next) {
    PrescriptionService.delete(req.params.prescription_id).then(function (data) {
        return res.send({result: data});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
exports.all = function (req, res, next) {
    PrescriptionService.getAll(req).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}