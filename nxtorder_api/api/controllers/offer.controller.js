const OfferService = require('../services/offer.service');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.register = function (req, res, next) {
//    console.log(req.body, 'reqqqqqq')
    var offerObj = req.body
//    console.log(req.body, "offfffff")
    offerObj.addedBy = req.user
//    offerObj.store = null;
    console.log(req.files, "offffffffffff")

    if (req.file) {
        console.log(req.file,"fileeeeeeeeeeee")
        offerObj.bannerImage = req.file.path
    }

    OfferService.create(offerObj, req.body.product_id, req.params.industry_id).then(function (offer) {
        
        
        return res.send({ result: offer });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.update = function (req, res, next) {
    var offer = req.body

    if (req.file) {
        offer.bannerImage = req.file.path
    }

    delete offer.store;

    OfferService.update(offer, req.params.offer_id)
        .then(function (offer) {
            return res.send({ result: offer });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.view = function (req, res, next) {
    OfferService.view(req.params.offer_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.delete = function (req, res, next) {
    OfferService.delete(req.params.offer_id).then(function (offer) {
        return res.send({ result: offer });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.all = function (req, res, next) {
    OfferService.getAll(req.params.product_id, req.query).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.products = function(req, res, next) {
//    OfferService.getAllProducts(req.params.store_id).then(function (data) {
    OfferService.getAllProducts(req.query).then(function (data) {
        console.log(data, "data")
        var final =[];
        _.each(data, function(obj) {
            if(obj.offerType == "Banner_Offer") {
                var object = {
                    offerCriteria:obj.offerCriteria,
                    bannerImage:obj.bannerImage,
                    startDate:obj.startDate,
                    endDate:obj.endDate,
                    description:obj.description,
                    _id:obj._id
                }
                final.push(object)
            }
        })
        console.log(req.query, "offfffffff")
        if(req.query.offerType == "Banner_Offer") {
            return res.send({ result: final })
        }
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};