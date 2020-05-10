const OrderService = require('../services/order.service');
const ProductService = require('../services/product.service');
const _ = require('lodash');
var asyncLoop = require("node-async-loop");
exports.register = function (req, res, next) {
    var orderObj = req.body
    orderObj.status = "Open"
    orderObj.user = req.user
    OrderService.create(orderObj, req.params.store_id).then(function (order) {
        console.log(order, "orderorderorder")
        return res.send({success: true, message: "Order placed successfully", result: order});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.update = function (req, res, next) {
    var order = req.body
    delete order.store;
    OrderService.update(order, req.params.order_id)
            .then(function (order) {
                return res.send({result: order});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.addProduct = function (req, res, next) {
    var productId = req.body.productId
    var variantId = req.body.variantId
    var quantity = req.body.quantity
    return OrderService.addProduct(req.params.order_id, productId, variantId, quantity)
            .then(function (order) {
                return res.send({result: order});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.removeProduct = function (req, res, next) {
    var productId = req.body.productId
    var variantId = req.body.variantId
    var quantity = req.body.quantity
    return OrderService.removeProduct(req.params.order_id, productId, variantId, quantity)
            .then(function (order) {
                return res.send({result: order});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.view = function (req, res, next) {
    OrderService.view(req.params.order_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.delete = function (req, res, next) {
    OrderService.delete(req.params.order_id).then(function (order) {
        return res.send({result: order});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.all = function (req, res, next) {
    var query = req.query
    OrderService.getAll(req.params.store_id, query).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}

exports.getOrdersWithuserId = function (req, res, next) {
//    var query = req.query
    OrderService.getAllOrdersUserId(req.params.user_id).then(function (data) {
        console.log(data, "datassss")
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}
//trendingProducts
exports.trendingProducts = function (req, res, next) {
//    var query = req.query
    console.log("innnntttttttt------------11111", req)
    OrderService.trendingProducts(req.query).then(function (data) {
        var array = [];
        if (data.length > 0) {
            asyncLoop(data, function (obj, next) {
                console.log(obj._id, "obj._id")
                OrderService.trendingProductsDetails(obj._id, req.query).then(function (data) {
                    console.log(data, "datassss111111111")
                    array.push(data)
                    next()
                })

            }, function () {
                return res.send({result: array})
            })
        } else {
            return res.send({result: array})
        }



    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}

exports.trendingProducts1 = function (req, res, next) {
//    var query = req.query
    console.log("innnntttttttt------------")
    OrderService.trendingProducts1().then(function (data) {
        console.log(data, "datassss")
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}

//recommendedProducts

exports.recommendedProducts = function (req, res, next) {
    var industryId = req.params.industry_id;
    console.log("innnntttttttt------------11111", req.query)
    OrderService.recommendedProducts(req.query).then(function (data) {
        var array = [];
        var count = 0;
        if (data.length > 0) {

            asyncLoop(data, function (obj, next) {
////                console.log(obj._id, "obj._id")
//                if (req.query.industry_id) {
//                    var query = {
//                        "_id": obj._id,
//                        "industry_id": req.query.industry_id
//                    }
//                } else {
//                    var query = {
//                    "_id": obj._id,
//                    
//                }
//                }

                OrderService.trendingProductsDetails(obj._id, req.query).then(function (data1) {
//                    console.log(data1._id, "dataaaaaaaaa")
                    if (data1 != null) {
                        ProductService.checkFavoriteProduct(data1._id, req.query).then(function (fav) {
                            var newObj;
                            if (fav.length > 0) {
//                                console.log("innnnnnnnnnn nooo")
                                newObj = data1
                                newObj.isFavourite = true;
//                            console.log("innnnnnnnnnn noooooooooooo", newObj)

                                array.push(newObj)
                            } else {
//                                console.log("innnnnnnnnnn yessssssssss")
                                newObj = data1
                                newObj.isFavourite = false;
//                            console.log("innnnnnnnnnn yessssssssss", newObj)
                                array.push(newObj)
                            }
//                        array.push(data)
//                        console.log(array, "datassss111111111")
                            count++;
//                        console.log(data.length, count, "cccccccccccccc")
                            if (data.length == count) {
//                            console.log(array, 'finalDatasssssssssssss')
//                        resolve(array)
                                return res.send({result: array})

                            }
                        })
                    } else {
                        console.log("in elseeeeeeeeeeee")
                        next();
                    }


                    next();
                })

            }, function () {
//                console.log(array, "222222222222222")

//                return res.send({result: array})
            })
        } else {
//            console.log("innnnnnnnnnn elseeeeeeee", array)

            return res.send({result: array})

        }

    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}
exports.topBrands = function (req, res, next) {
//    var industryId = req.params.industry_id;
//    console.log("innnntttttttt------------11111")
    OrderService.topBrands(req.query).then(function (data) {
        var array = [];
        if (data.length > 0) {
            console.log("in length")
            asyncLoop(data, function (obj, next) {
                console.log(obj._id, "obj._id")
                OrderService.trendingProductsDetails(obj._id, req.query).then(function (data) {
//                console.log(data, "datassss111111111")
                    array.push(data)
                    next();
                })

            }, function () {
                return res.send({result: array})
            })
        } else {
            console.log("in without length")
            return res.send({result: array})
        }



    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}
