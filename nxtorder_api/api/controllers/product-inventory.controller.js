const ProductInventoryService = require('../services/product-inventory.service');

exports.register = function (req, res, next) {
    var productInventoryObj = {}
    productInventoryObj.product = req.body.product
    productInventoryObj.variant = req.body.variant
    productInventoryObj.barcodeBase64 = req.body.barcodeBase64
    productInventoryObj.serialNo = req.body.serialNo
    productInventoryObj.batchNo = req.body.batchNo
    productInventoryObj.status = 'Available'

    ProductInventoryService.create(productInventoryObj, req.params.store_id).then(function (productInventory) {
        return res.send({ result: productInventory });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.update = function (req, res, next) {
    var productInventoryObj = {}
    productInventoryObj.product = req.body.product
    productInventoryObj.variant = req.body.variant
    productInventoryObj.barcodeBase64 = req.body.barcodeBase64
    productInventoryObj.serialNo = req.body.serialNo
    productInventoryObj.batchNo = req.body.batchNo
    productInventoryObj.status = req.body.status

    ProductInventoryService.update(productInventoryObj, req.params.inventory_id)
        .then(function (productInventory) {
            return res.send({ result: productInventory });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.view = function (req, res, next) {
    ProductInventoryService.view(req.params.inventory_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.delete = function (req, res, next) {
    ProductInventoryService.delete(req.params.inventory_id).then(function (productInventory) {
        return res.send({ result: productInventory });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.all = function (req, res, next) {
    ProductInventoryService.getAll(req.params.store_id, req.query).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.inventoryProducts = function (req, res, next) {
    ProductInventoryService.inventoryProducts(req.params.store_id, req.query).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};