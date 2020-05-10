const FlashService = require('../services/flash.service');
const Msg = require('../../config/strings');

exports.register = function (req, res, next) {

    var flashObj = req.body
    flashObj.addedBy = req.user

    if (req.file) {
        flashObj.bannerImage = req.file.path
    }

    FlashService.create(flashObj, req.params.product_id).then(function (offer) {
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
    OfferService.getAll(req.params.user_id, req.query).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.products = function(req, res, next) {
    OfferService.getAllProducts(req.params.store_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};