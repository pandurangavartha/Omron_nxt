const PrivacyService = require('../services/privacy.service');
const _ = require('lodash');
exports.create = function (req, res, next) {
    console.log(req.body, "req")
    var privacyObj = req.body;
    privacyObj.htmlBody = JSON.stringify(req.body.htmlBody);
    console.log(req.body, "objjjjjjj")
//    if (req.file) {
//        blogsObj.image = req.file.path
//    }

    PrivacyService.create(privacyObj).then(function (privacy) {
        return res.send({result: privacy});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
exports.update = function (req, res, next) {
    var privacyObj = req.body;
    console.log(privacyObj, "blogObjblogObj")
    if (req.body.htmlBody) {
        privacyObj.htmlBody = JSON.stringify(req.body.htmlBody);
    }
    
    PrivacyService.update(privacyObj, req.params.privacy_id)
            .then(function (privacyData) {
                return res.send({result: privacyData});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};
//
exports.view = function (req, res, next) {
    PrivacyService.view(req.params.privacy_id).then(function (data) {
        data.htmlBody = JSON.parse(data.htmlBody)
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
exports.delete = function (req, res, next) {
    PrivacyService.delete(req.params.privacy_id).then(function (privacy) {
        return res.send({ result: privacy });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
//
exports.all = function (req, res, next) {
    PrivacyService.getAll(req.query).then(function (data) {
        _.each(data, function (obj) {
            obj.htmlBody = JSON.parse(obj.htmlBody)
        })
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}

