const CartService = require('../services/cart.service');
const _ = require('lodash');
exports.register = function (req, res, next) {
    console.log("innnnnnnn carttt")
    var cartObj = req.body;
//    cartObj.user = req.user;
    console.log(cartObj, "objjj")
//    return false;
    CartService.create(cartObj).then(function (cart) {
        return res.send({result: cart});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.update = function (req, res, next) {
    var cart = req.body
    CartService.update(cart, req.params.id)
            .then(function (cart) {
                return res.send({result: cart});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.view = function (req, res, next) {
    CartService.view(req.params.id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.delete = function (req, res, next) {
    CartService.delete(req.params.id).then(function (cart) {
        return res.send({result: cart});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.all = function (req, res, next) {
    CartService.getAll(req.params.store_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}

exports.cartAllItems = function (req, res, next) {
    CartService.getItemsAll(req.params.user_id).then(function (data) {
        let totalAmount = _.sumBy(data, function (o) {
            return o.price;
        });
        var deliveryCharges = 0;
        var obj = {
            totalItems: data.length,
            totalAmount:totalAmount,
            deliveryCharges:deliveryCharges,
            totalAmountPayable: totalAmount + deliveryCharges
        }
        return res.send({result: data, total: obj})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}