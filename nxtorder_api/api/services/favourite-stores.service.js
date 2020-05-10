const Promise = require('bluebird');

const FavouriteStores = require('../models/favourite-stores.model');
const StoreModel = require('../models/store.model');
const Msg = require('../../config/strings');

exports.create = function (favouriteStoresObj) {
    const storeId = favouriteStoresObj.store._id;
    const userId = favouriteStoresObj.user._id;
    const query = {
        deleted: {$exists: false},
        "store._id": storeId,
        "user._id": userId}
    return FavouriteStores.find(query).exec().then(function (data) {
        if (data.length > 0) {
            return Promise.resolve(data[0]);
        } else {
            return FavouriteStores.create(favouriteStoresObj)
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
exports.delete = function (favouriteStoreId) {
    return FavouriteStores.findByIdAndUpdate(favouriteStoreId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};

exports.unfavStores = function (favouriteStoreId) {

    var query = {
        "store._id": favouriteStoreId
    }
    console.log(query, "queryyyys")
    return FavouriteStores.find(query).exec().then(function (data) {
        console.log(data, "datataaaa")
        if (data.length > 0) {
            return FavouriteStores.findByIdAndUpdate(data[0]._id, {deleted: true}, {
                new : true,
                runValidators: true
            });
        }
    })
};
//
//
//exports.getAll = function (storeId) {
//    return Cart.find({ deleted: { $exists: false }, "store._id": storeId }).exec();
//};
//
const _ = require('lodash');
var asyncLoop = require("node-async-loop");

exports.getItemsAll = function (user_id, req) {
    console.log("in storessssss")
    return new Promise((resolve, reject) => {
        var query = {
            deleted: {$exists: false}, "user._id": user_id
        }
        if (req.industry_id) {
            query['industry._id'] = req.industry_id;
        }
//    return FavouriteStores.find({deleted: {$exists: false}, "user._id": user_id}).exec();
        return FavouriteStores.find(query).then(function (subdata) {
            var finalData = [];
            var count = 0;
            if (subdata.length > 0) {
                asyncLoop(subdata, function (obj, next) {
                    console.log(obj.store._id, 'sore')
                    query = {
                        "_id": obj.store._id
                    }
                    return StoreModel.find(query).exec().then(function (data) {
                        console.log(data, "dataaaaaaaa")
                        var finalObj = {
                            _id: obj._id,
//                        user:obj.user,
                            store: data[0]
                        }
                        finalData.push(data[0]);
                        count++;
                        if (subdata.length == count) {
//                        return Promise.resolve(finalData);
                            resolve(finalData);
                        }
                    })
                    next();
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
}