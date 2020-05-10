const IndustryService = require('../services/industry.service');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.register = function (req, res, next) {
    var industryObj = req.body;
//    console.log("innnnnnnnnnnnn")
    industryObj = {
        industryName: req.body.industryName,
        code: req.body.code,
        status: 'Pending Approval',
    }
    console.log(req.files, industryObj, "fileeeeeeeeeeeee")
    var banners = []
    if (req.files) {
        _.each(req.files, function (obj) {
            const pa = 'public/bulkuploads/' + obj.originalname;    
            console.log(pa, "paaaaa")
            var object = {
                banner: pa
            }
            banners.push(object)

        })
        industryObj.banners = banners
    }
//    return false;
    console.log(industryObj, industryObj, "bbbbbbbbbbbbbb")
//    return false;
    IndustryService.create(industryObj).then(function (industry) {
        if (industry) {
            console.log("in insutry 2222222222")
            return res.send({result: industry});
        } else {
            return res.status(400).send({result: {error: Msg.INDUSTRY_CREATION_FAILED}})
        }
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}
exports.update = function (req, res, next) {
    var industry = req.body;
    var banners = [];
    console.log(req.files, "filess")
    if (req.files) {
        _.each(req.files, function (obj) {
            const pa = 'public/bulkuploads/' + obj.originalname;    
            console.log(pa, "paaaaa")
            var object = {
                banner: pa
            }
            banners.push(object)

        })
        industry.banners = banners
//        console.log(industry, "industryy")
    } 
//    console.log(industry, "industryyyy")
    IndustryService.update(industry, req.params.industry_id)
            .then(function (industry) {
                return res.send({result: industry});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.view = function (req, res, next) {
    IndustryService.view(req.params.industry_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
exports.delete = function (req, res, next) {
    IndustryService.delete(req.params.industry_id).then(function (data) {
        return res.send({result: data});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//
exports.all = function (req, res, next) {
    console.log("in indutryyyyy1111111111")
    IndustryService.getAll().then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}