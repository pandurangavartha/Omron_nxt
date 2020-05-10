const Promise = require('bluebird');

const Cart = require('../models/cart.model');
const Msg = require('../../config/strings');

exports.create = function (cartObj) {
    var Quantity = cartObj.quantity;
    var calPrice = (Quantity * (cartObj.variant.variantRetailPrice * cartObj.variant.variantTaxPercent) / 100)
//    console.log((Quantity * (cartObj.variant.variantRetailPrice * cartObj.variant.variantTaxPercent)/100), "cartObjcartObjcartObj")
//    console.log(Quantity,(cartObj.variant.variantRetailPrice * cartObj.variant.variantTaxPercent)/100, "ooooooooooooo")
    cartObj.price = cartObj.variant.variantRetailPrice + calPrice;
   const userId = cartObj.user._id;
    const query = {
        deleted: {$exists: false},
        "product._id": cartObj.product._id,
        "variant._id":cartObj.variant._id,
        "user._id": userId
    }
    return Cart.find(query).exec().then(function (data) {
        if (data.length > 0) {
            const quantity = data[0].quantity + 1;
            return Cart.findByIdAndUpdate(data[0]._id, {$set: {quantity: quantity}}, {
                new : true,
                runValidators: true
            });
//            return Promise.resolve(data[0]);
        } else {
            return Cart.create(cartObj)
                    .then(function (cart) {
                        return Promise.resolve(cart);
                    }).catch(function (err) {
                if (err.name === 'ValidationError') {
                    var err1 = new Error(err.message);
                    err1.status = 400;
                    return Promise.reject(err1);
                }
                var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
                err2.status = 500;
                return Promise.reject(err2);
            });
        }
    })
};
// mulptiple cart items add
exports.update = function (cart, cartId) {
    return Cart.findByIdAndUpdate(cartId, cart, {
        new : true,
        runValidators: true
    });
};

exports.view = function (cartId) {
    return Cart.findById(cartId).exec().then(function (cart) {
        if (cart.deleted) {
            var err2 = new Error(Msg.USER_NOT_EXISTS);
            err2.status = 204;
            return Promise.reject(err2);
        }
        return Promise.resolve(cart);
    })
};

exports.delete = function (cartId) {
    return Cart.findByIdAndUpdate(cartId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};

exports.getAll = function (storeId) {
    return Cart.find({deleted: {$exists: false}, "store._id": storeId}).exec();
};

exports.getItemsAll = function (user_id) {

    return Cart.find({deleted: {$exists: false}, "user._id": user_id}).exec();
};