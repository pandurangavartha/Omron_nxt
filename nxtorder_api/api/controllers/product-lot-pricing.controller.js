const ProductLotPricingService = require('../services/product-lot-pricing.service');
const Msg = require('../../config/strings');

exports.register = function (req, res, next) {
    var pLotPriceObj = {};

    pLotPriceObj.variant = req.body.variant
    pLotPriceObj.lotSize = req.body.lotSize
    pLotPriceObj.lotPrice = req.body.lotPrice
    pLotPriceObj.discount = req.body.discount
    pLotPriceObj.discountIsPercent = req.body.discountIsPercent

    ProductLotPricingService.create(pLotPriceObj, req.params.product_id)
        .then(function (pLotPrice) {
            return res.send({ result: pLotPrice });
        }).catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        });
};

exports.update = function (req, res, next) {
    var pLotPriceObj = {};

    if (req.body.product) {
        pLotPriceObj.product = req.body.product
    }

    if (req.body.variant) {
        pLotPriceObj.variant = req.body.variant
    }

    if (req.body.lotSize) {
        pLotPriceObj.lotSize = req.body.lotSize
    }

    if (req.body.lotPrice) {
        pLotPriceObj.lotPrice = req.body.lotPrice
    }

    if (req.body.discount) {
        pLotPriceObj.discount = req.body.discount
    }

    if (req.body.discountIsPercent) {
        pLotPriceObj.discountIsPercent = req.body.discountIsPercent
    }

    ProductLotPricingService.update(pLotPriceObj, req.params.bulk_pricing_id)
        .then(function (pLotPrice) {
            return res.send({ result: pLotPrice });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.delete = function (req, res, next) {
    ProductLotPricingService.delete(req.params.bulk_pricing_id)
        .then(function (pLotPrice) {
            return res.send({ result: pLotPrice });
        }).catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        });
};

exports.view = function (req, res, next) {
    ProductLotPricingService.view(req.params.bulk_pricing_id)
        .then(function (data) {
            return res.send({ result: data })
        }).catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        });
};

exports.getAllBulkPricings = function (req, res, next) {

    ProductLotPricingService.getLotsForProduct(req.params.product_id, req.query)
        .then(function (data) {
            return res.send({ result: data })
        }).catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        });
};