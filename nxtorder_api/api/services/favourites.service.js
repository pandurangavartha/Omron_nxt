const Promise = require('bluebird');

const Favourites = require('../models/favourites.model');
const Products = require('../models/product.model');
const StoreProducts = require('../models/store-product.model');
const Msg = require('../../config/strings');
var asyncLoop = require("node-async-loop");
exports.create = function (favouritesObj) {
    const productId = favouritesObj.product._id;
    const userId = favouritesObj.user._id;
    const query = {
        deleted: {$exists: false},
        "product._id": productId,
        "user._id": userId}
    return Favourites.find(query).exec().then(function (data) {
        if (data.length > 0) {
            return Promise.resolve(data[0]);
        } else {

//            return false;
//            delete favouritesObj.product;
            console.log(favouritesObj, "favouritesObjfavouritesObj")
            return Favourites.create(favouritesObj)
                    .then(function (favourites) {
                        return Promise.resolve(favourites);
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
    });
}
//
//exports.update = function (cart, cartId) {
//    return Cart.findByIdAndUpdate(cartId, cart, {
//        new: true,
//        runValidators: true
//    });
//};
//
//exports.view = function (cartId) {
//    return Cart.findById(cartId).exec().then(function (cart) {
//        if (cart.deleted) {
//            var err2 = new Error(Msg.USER_NOT_EXISTS);
//            err2.status = 204;
//            return Promise.reject(err2);
//        }
//        return Promise.resolve(cart);
//    })
//};
//
exports.delete = function (favouriteId) {
    return Favourites.findByIdAndUpdate(favouriteId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};

//
exports.unfavourite = function (productId) {
    var query = {
        "product._id": productId
    }
    return Favourites.find(query).exec().then(function (data) {
        console.log(data, "datataaaa")
        if (data.length > 0) {
            return Favourites.findByIdAndUpdate(data[0]._id, {deleted: true}, {
                new : true,
                runValidators: true
            });
        } else {

        }
//        return false;

    })
};
//
//exports.getAll = function (storeId) {
//    return Cart.find({ deleted: { $exists: false }, "store._id": storeId }).exec();
//};
//
exports.getItemsAll = function (user_id, req) {
//    return Favourites.find({deleted: {$exists: false}, "user._id": user_id}).exec();
//    return false;
    return new Promise((resolve, reject) => {
        var query = {
            deleted: {$exists: false}, "user._id": user_id
        }
        if (req.industry_id) {
            query['industry._id'] = req.industry_id;
        }
        var agg = [
            {$match: query},
//            {$unwind:'$product'},
//            {$lookup: {
//                    from: "Product",
//                    localField:"productId",
//                    foreignField: "_id",    
//                    as: "product"
//                }
//            },
//            {$group: {_id: "user._id"}}
        ]
        console.log(agg, "aggg")
//    return FavouriteStores.find({deleted: {$exists: false}, "user._id": user_id}).exec();
//        return Favourites.find(query).then(function (subdata) {
        return Favourites.aggregate(agg).then(function (subdata) {
            console.log(subdata, "dataaaaaaaaaaaaaaa")
            if (subdata.length > 0) {
                var finalData = [];
                var count = 0;
                asyncLoop(subdata, function (obj, next) {
//                console.log(obj.store._id, 'sore')
                    query = {
                        "_id": obj.product._id
                    }
//                console.log(obj.product._id, "idddddddddddd")
//                if (req.industry_id) {
//                    query['industry._id'] = req.industry_id;
//                }

                    return StoreProducts.find(query).exec().then(function (data) {
//                    console.log(data, "dataaaaaaaa")
                        var finalObj = {
                            _id: obj._id,
//                        user: obj.user,
                            product: data[0]
                        }

                        count++;
//                    console.log(finalObj, count, "countttt")
                        finalData.push(data[0]);
//                    count++;
//                    console.log(subdata, count, "countttt")
                        if (subdata.length == count) {
//                        console.log(finalData, "innnnnnn")
//                        return Promise.resolve(finalData);
                            resolve(finalData);
                        }
                        next();
                    })
//                next();
                }, function (err) {
                    if (err) {
                        console.error('Error: ' + err.message);
                        return;
                    }
                });
            } else {
                var err2 = "no data found";
                err2.status = 500;
                return resolve(err2);
            }
        });
    })
};