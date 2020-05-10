const Promise = require('bluebird');

const Store = require('../models/store.model');
const StoreProductService = require('../services/store-products.service');
//const ProductService = require('../services/product.service');
//const Favourites = require('../services/favourites');
const Order = require('../models/order.model');
const OrderItem = require('../models/order-item.model');
const ProductModel = require('../models/product.model');
const StoreProductModel = require('../models/store-product.model');
const Msg = require('../../config/strings');
const _ = require('lodash');
var asyncLoop = require("node-async-loop");
exports.create = function (orderObj, storeId) {
    let finalData;
    return new Promise((resolve, reject) => {
        var variantId, quantity;
        var productId;
        var count = 0;
        console.log(orderObj.orderItems, "orderObj.orderItems")

        var final = asyncLoop(orderObj.orderItems, function (obj, next) {
            console.log("innnnnnnnnnnnnnnnnnnnn")
            variantId = obj.variant._id;
            var productId = obj.product._id
            quantity = obj.quantity;
            finalData = [];

            StoreProductService.getProductWithVariant(productId, variantId)
                    .then(function (result) {
                        console.log("innnnnnnnnnnnnnnnnnnnn")
                        var itemPrice = result.variant.variantRetailPrice * quantity
                        var itemTax = itemPrice * (result.variant.variantTaxPercent / 100)
                        console.log(result, "result111111111111") 
                        var industryyyyy = result.industry
                        var industry = industryyyyy._id
                        
                        var orderItem = {
                            product: result.product,
                            variant: result.variant,
                            quantity: quantity,
                            price: itemPrice,
                            taxPercent: itemTax
                        }
                        var address = {
                            city: orderObj.shippingAddress.city,
                            country: orderObj.shippingAddress.country,
                            state: orderObj.shippingAddress.state,
                            zipcode: orderObj.shippingAddress.zipcode,
                            line2: orderObj.shippingAddress.line2,
                            line1: orderObj.shippingAddress.line1
                        }
                        obj.totalAmount = itemPrice
                        obj.orderType = orderObj.orderType
                        obj.taxAmount = itemTax
                        obj.status = orderObj.status
                        obj.user = orderObj.user
                        obj.billAmount = itemPrice
                        obj.orderItems = orderItem
                        obj.shippingAddress = address
                        obj.store = result.store;
                        obj.paymentDetails = orderObj.paymentDetails;
                        console.log(industry,obj, "indusryyyy")
                        obj.industryId = industry;
                        orderItem.industryId = industry;
//                        return false;
//                        count++;
//                        console.log(count, "counttttttttttttttttt")
                        Order.create(obj);
                        OrderItem.create(obj.orderItems);
//                        console.log(obj, "objectttttttttttttt")
                        finalData.push(obj);
                        count++;
                        console.log((orderObj.orderItems).length, count, "cccccccccccccc")
                        if ((orderObj.orderItems).length == count) {
                            console.log(finalData, 'finalDatasssssssssssss')
                            resolve(finalData)
                        }
//                        finalData.push(obj);
//                        return finalArray;
//                        console.log('mmmmmmmmmmmm', finalData);
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
//            console.log(obj, "objectttttttttttttt")
//            finalData.push(obj);
//            count++;
//            console.log((orderObj.orderItems).length, count, "cccccccccccccc")
//            if ((orderObj.orderItems).length == count) {
//                console.log(finalData, 'finalDatasssssssssssss')
//                resolve(finalData)
//            } else {
            next();
//            }

        }, function (err) {
            if (err) {
                console.error('Error: ' + err.message);
                return;
            }

            console.log('Finished!', finalData);
//            resolve(finalData);
        });
//        resolve(final)
    })
};

exports.update = function (order, orderId) {
    return Order.findByIdAndUpdate(orderId, order, {
        new : true,
        runValidators: true
    });
};

exports.view = function (orderId) {
    return Order.findById(orderId).exec();
};

exports.delete = function (orderId) {
    return Order.findByIdAndUpdate(orderId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};
exports.trendingProducts1 = function () {
    console.log("datainnnnnnnn")
    var agg = [

        {"$group": {"_id": "$product._id", count: {$sum: 1}}},
        {"$lookup": {from: "Product", localField: "_id", foreignField: "$_id", as: "productData"}},
//            { "$unwind": "$orderItems"},
//            {$match:{}}


//            "$group": {"_id": "$product._id", count: {$sum: 1}},
    ];
    return OrderItem.aggregate(agg, function (err, data) {
        console.log(data, "dataaaa");
        return data
    });
}
exports.trendingProducts = function (req) {
    console.log(req, "reqqqqqqqq")
    if (req.industry_id) {
        var agg = [
            {$match: {"industryId": req.industry_id}},
            {"$group": {
                    "_id": "$product._id",
                    count: {
                        $sum: 1
                    },
                    idRef: {$first: "$product._id"},
                }
            }
        ];
    } else {
        var agg = [
            {"$group": {
                    "_id": "$product._id",
                    count: {
                        $sum: 1
                    },
                    idRef: {$first: "$product._id"},
                }
            }
        ];

    }

    return OrderItem.aggregate(agg, function (err, data) {
//        console.log(data, "dataaaa");
        return data
    });
}
//  product details
exports.trendingProductsDetails = function (id, req) {

    if (req.industry_id) {
        var query = {
            "_id": id,
//            "industry._id": req.industry_id
        }
        console.log(req.industry_id, query, "industry id111111111111")
//        query["industry._id"]=req.industry_id
    } else {
        var query = {
            "_id": id,
//        "industry._id":req.industry_id
        }
    }
    return StoreProductModel.findOne(query, function (err, data) {
//        return
//        console.log(data, "dataaaa");

        return data
    });
}
// recommended products
exports.recommendedProducts = function (req) {
    var match;
    var agg;
    console.log(req, req.industry_id, "reqqqqqqqqqq")
    if (req.industry_id) {
        agg = [
//            {$match: match},
            {$match: {"industryId": req.industry_id}},
            {"$group": {
                    "_id": "$product._id",
                    count: {
                        $sum: 1
                    },
                    idRef: {$first: "$product._id"},
                }
            }
        ];
    } else {
        agg = [
            {"$group": {
                    "_id": "$product._id",
                    count: {
                        $sum: 1
                    },
                    idRef: {$first: "$product._id"},
                }
            }
        ];
    }
    console.log(agg, "agggggggg")
    return OrderItem.aggregate(agg, function (err, data) {
        console.log(data, "dataaaa ordersss");
        return data
    });
}
// top brands products
exports.topBrands = function (req) {
    if (req.industry_id) {
        var agg = [
//            { $match: {"industry._id": req.industry_id} },
            {"$group": {
                    "_id": "$product._id",
                    count: {
                        $sum: 1
                    },
                    idRef: {$first: "$product._id"},
                }
            }
        ];
    } else {

        var agg = [
//        {$match: {"industry._id": industryId}},
            {"$group": {
                    "_id": "$product._id",
                    count: {
                        $sum: 1
                    },
                    idRef: {$first: "$product._id"},
                }
            }
        ];

    }


    return OrderItem.aggregate(agg, function (err, data) {
        console.log(data, "dataaaa");
        return data
    });
}
exports.addProduct = function (orderId, productId, variantId, quantity) {
    return Promise.all([
        Order.findById(orderId),
        ProductService.getProductWithVariant(productId, variantId)
    ]).then(function (result) {
        var order = result[0].toJSON()
        delete order.createdAt;

        var orderItem = result[1]
        orderItem.quantity = quantity
        orderItem.price = orderItem.variant.variantRetailPrice * quantity
        orderItem.taxPercent = orderItem.price * (orderItem.variant.variantTaxPercent / 100)

        order.orderItems.push(orderItem)

        var total = 0;
        var tax = 0;
        //calculating total bill by parsing all items in the order with quantity.
        _.each(order.orderItems, function (e) {
            total = total + item.variant.variantRetailPrice * item.quantity;
            tax = tax + ((orderItem.variant.variantRetailPrice * quantity) * (orderItem.variant.variantTaxPercent / 100))
        })

        order.totalAmount = total;
        order.taxAmount = tax;
        order.billAmount = total;

        return Order.findOneAndUpdate({_id: orderId, deleted: {$exists: false}}, order, {
            new : true,
            runValidators: true
        })
    }).then(function (data) {
        return Promise.resolve(data)
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
};

exports.removeProduct = function (orderId, productId, variantId, quantity) {
    return Promise.all([
        Order.findById(orderId),
        ProductService.getProductWithVariant(productId, variantId)
    ]).then(function (result) {
        var order = result[0].toJSON()
        delete order.createdAt;
        var orderItem = result[1]
        if (quantity == orderItem.quantity) {
            _.remove(order.orderItems, function (e) {
                return (e.product._id == productId && e.variant._id == variantId);
            });
        } else if (quantity < orderItem.quantity) {
            _.each(order.orderItems, function (e) {
                if (e.product._id == productId && e.variant._id == variantId) {
                    e.quantity = e.quantity - quantity;
//                    break;
                }
            });
        }
//
        var total = 0;
        var tax = 0;
        //calculating total bill by parsing all items in the order with quantity.
        _.each(order.orderItems, function (e) {
            total = total + e.variant.variantRetailPrice * e.quantity;
            tax = tax + ((e.variant.variantRetailPrice * quantity) * (e.variant.variantTaxPercent / 100))
        })
//
        order.totalAmount = total;
        order.taxAmount = tax;
        order.billAmount = total;

        return Order.findOneAndUpdate({_id: orderId, deleted: {$exists: false}}, order, {
            new : true,
            runValidators: true
        })
    }).then(function (data) {
        return Promise.resolve(data)
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
};

exports.getAll = function (storeId, req) {
    var query = {deleted: {$exists: false}}

    query["store._id"] = storeId

    if (req.orderType) {
        query["orderType"] = req.orderType
    }

    return Order.find(query).exec();
};
exports.getAllOrdersUserId = function (userId) {
    var query = {
//        deleted: {$exists: false},
        "user._id": userId
    }
    console.log(query, "queryquery")
//    query["store._id"] = storeId

//    if (req.orderType) {
//        query["orderType"] = req.orderType
//    }

    return Order.find(query).exec();
};







//
//   modified:   api/models/order-item.model.js
//        modified:   api/models/order.model.js
//        modified:   api/services/order.service.js
//        modified:   api/services/store-products.service.js
