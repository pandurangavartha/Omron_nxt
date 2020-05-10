const Promise = require('bluebird');

const Product = require('../models/product.model');
const ProductInventory = require('../models/product-inventory.model');
const Favourites = require('../models/favourites.model');
const Offer = require('../models/offer.model');
const Store = require('../models/store.model');
const Msg = require('../../config/strings');
const _ = require('lodash');
var asyncLoop = require("node-async-loop");

exports.create = function (productObj) {
//    return Store.findById(storeId)
//            .then(function (store) {
//    var storeObj = {}
//    storeObj._id = store._id
//    storeObj.storeName = store.storeName
//
//    productObj.store = storeObj
//    console.log(productObj, "0p0000000000000000000000")
    return Product.create(productObj)
//            }).then(function (product) {
//        return product;
//    }).catch(function (err) {
//        if (err.name === 'ValidationError') {
//            var err1 = new Error(err.message);
//            err1.status = 400;
//            return Promise.reject(err1);
//        }
//        var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
//        err2.status = 500;
//        return Promise.reject(err2);
//    });
};

exports.update = function (product, productId) {
    return Product.findByIdAndUpdate(productId, product, {
        new : true,
        runValidators: true
    });
};

exports.activate = function (productId) {
    return Product.findByIdAndUpdate(productId, {status: "Active"}, {
        new : true,
        runValidators: true
    });
};

exports.deactivate = function (productId) {
    return Product.findByIdAndUpdate(productId, {status: "InActive"}, {
        new : true,
        runValidators: true
    });
};

exports.view = function (productId) {
    return Product.findById(productId);
};

exports.delete = function (productId) {
    return Product.findByIdAndUpdate(productId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};
// get products by sub category
exports.products = function (subCategoryId, req) {
    var query = {
        deleted: {$exists: false},
        "subcategories._id": subCategoryId
    };
    return Product.find(query)
            .then(function (products) {
                return Promise.resolve(products);
            })
}

exports.getAll = function (storeId, req) {

    var query = {
        deleted: {$exists: false},
        "store._id": storeId
    };

    if (req.status) {
        query.status = req.status
    } else {
        query.status = 'Active'
    }

    if (req.productName) {
        query.productName = new RegExp(req.productName, 'i')
    }

    if (req.brand) {
        query.brand = new RegExp(req.brand, 'i')
    }

    if (req.manufacturer) {
        query.manufacturer = new RegExp(req.manufacturer, 'i')
    }

    if (req.baseRetailPrice) {
        query.baseRetailPrice = req.baseRetailPrice
    }

    if (req.variantName) {
        query.variants = {$elemMatch: {variantName: new RegExp(req.variantName, 'i')}}
    }

    if (req.categoryName) {
        query.categories = {$elemMatch: {categoryName: new RegExp(req.categoryName, 'i')}}
    }
    if (req.categoryName && req.subcategoryName) {
        var query = {
//            $and: [{
//            $elemMatch: {
            "categories.categoryName": new RegExp(req.categoryName, 'i'),
            "subcategories.subcategoryName": new RegExp(req.subcategoryName, 'i')
//            }
//                }]
        };
//        var subcategories = {$elemMatch: {subcategoryName: new RegExp(req.subcategoryName, 'i')}};
//        query = {
//            "industry._id": req.industry_id,
//            isBulkOrdersAccept: req.isBulkOrdersAccept
//        }
//        query.categories = category
//        query.categories = { $elemMatch: { categoryName: new RegExp(req.categoryName, 'i') } }
    }
    if (req.subcategoryName) {
        query.subcategories = {$elemMatch: {subcategoryName: new RegExp(req.subcategoryName, 'i')}}
    }
    console.log(query, "queryyyyyyyy")
    return Product.find(query);
};

// new arrivals
// 
exports.newArrivals = function (req) {

    var query = {
        deleted: {$exists: false},
//        find().sort({datefield: -1}
    };
    console.log(req, "bbbbbbbb")
    if (req.status) {
        query.status = req.status;
        consoled.log(req.status, "statusss")
    } else {

        query.status = 'Active'
    }

    if (req.productName) {
        query.productName = new RegExp(req.productName, 'i')
    }

    if (req.brand) {
        query.brand = new RegExp(req.brand, 'i')
    }

    if (req.manufacturer) {
        query.manufacturer = new RegExp(req.manufacturer, 'i')
    }

    if (req.baseRetailPrice) {
        query.baseRetailPrice = req.baseRetailPrice
    }
    if (req.industry_id) {
        query['industry._id'] = req.industry_id
    }

    if (req.variantName) {
        query.variants = {$elemMatch: {variantName: new RegExp(req.variantName, 'i')}}
    }

    if (req.categoryName) {
        query.categories = {$elemMatch: {categoryName: new RegExp(req.categoryName, 'i')}}
    }
    if (req.categoryName && req.subcategoryName) {
        var query = {
            "categories.categoryName": new RegExp(req.categoryName, 'i'),
            "subcategories.subcategoryName": new RegExp(req.subcategoryName, 'i')
        };
    }
    if (req.subcategoryName) {
        query.subcategories = {$elemMatch: {subcategoryName: new RegExp(req.subcategoryName, 'i')}}
    }

    console.log(query, "queryyyyyyyy")
    return Product.find(query).sort({createdAt: -1});
};
// industrywise products
exports.industryWise = function (req) {

    var query = {
        deleted: {$exists: false},
    };
    if (req.industryId) {
        query["industry._id"] = req.industry_id
    }
    if (req.status) {
        query.status = req.status
    } else {
        query.status = 'Active'
    }

    if (req.productName) {
        query.productName = new RegExp(req.productName, 'i')
    }

    if (req.brand) {
        query.brand = new RegExp(req.brand, 'i')
    }

    if (req.manufacturer) {
        query.manufacturer = new RegExp(req.manufacturer, 'i')
    }

    if (req.baseRetailPrice) {
        query.baseRetailPrice = req.baseRetailPrice
    }

    if (req.variantName) {
        query.variants = {$elemMatch: {variantName: new RegExp(req.variantName, 'i')}}
    }

    if (req.categoryName) {
        query.categories = {$elemMatch: {categoryName: new RegExp(req.categoryName, 'i')}}
    }
    if (req.categoryName && req.subcategoryName) {
        var query = {
            $elemMatch: {
                categoryName: new RegExp(req.categoryName, 'i'),
                subcategoryName: new RegExp(req.subcategoryName, 'i')
            }
        };
    }
    if (req.subcategoryName) {
        query.subcategories = {$elemMatch: {subcategoryName: new RegExp(req.subcategoryName, 'i')}}
    }
    if (req.categoryName && req.categoryName && req.subcategoryName) {
        var query = {
            $elemMatch: {
                categoryName: new RegExp(req.categoryName, 'i'),
                subcategoryName: new RegExp(req.subcategoryName, 'i')
            }
        };
    }
    console.log(query, "queryyyyyyyy")
    var agg = [{
            $match: query},
        {$lookup: {
                from: "productrating",
                localField: "_id",
                foreignField: "product._id",
                as: "rating"
            }
        },
        {
            $unwind: {
                path: "$out",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$out.product._id", total: {$sum: 1}
            }
        },
        {$sort: {"total": -1}},
        {$project: {book: "$_id.productName", totalCount: "$total", _id: 0}}
    ]
    console.log(agg, "agg")
    return Product.find(query);
//    return Product.aggregate(agg);
};

exports.singleSubcategory = function (industryId, categoryId, subcategoryId, req) {

    var query = {
        deleted: {$exists: false},
        "industry._id": industryId,
        "categories._id": categoryId,
        "subcategories._id": subcategoryId
    };

    if (req.status) {
        query.status = req.status
    } else {
        query.status = 'Active'
    }

    if (req.productName) {
        query.productName = new RegExp(req.productName, 'i')
    }

    if (req.brand) {
        query.brand = new RegExp(req.brand, 'i')
    }

    if (req.manufacturer) {
        query.manufacturer = new RegExp(req.manufacturer, 'i')
    }

    if (req.baseRetailPrice) {
        query.baseRetailPrice = req.baseRetailPrice
    }

    if (req.variantName) {
        query.variants = {$elemMatch: {variantName: new RegExp(req.variantName, 'i')}}
    }

    if (req.categoryName) {
        query.categories = {$elemMatch: {categoryName: new RegExp(req.categoryName, 'i')}}
    }
    if (req.categoryName && req.subcategoryName) {
        var query = {
            $elemMatch: {
                categoryName: new RegExp(req.categoryName, 'i'),
                subcategoryName: new RegExp(req.subcategoryName, 'i')
            }
        };
    }
    if (req.subcategoryName) {
        query.subcategories = {$elemMatch: {subcategoryName: new RegExp(req.subcategoryName, 'i')}}
    }
    if (req.categoryName && req.categoryName && req.subcategoryName) {
        var query = {
            $elemMatch: {
                categoryName: new RegExp(req.categoryName, 'i'),
                subcategoryName: new RegExp(req.subcategoryName, 'i')
            }
        };
    }
    console.log(query, "queryyyyyyyy")
    return Product.find(query);
};

exports.vendors = function (productId, req) {
    return Product.findById(productId)
            .then(function (product) {
                return Promise.resolve(product.vendors);
            })
}

exports.vendorsProducts = function (storeId) {
    return Product.find({"store._id": storeId, "vendors.0": {$exists: true}})
            .then(function (products) {
                return Promise.resolve(products);
            })
};

exports.searchVendor = function (name) {
    var query = {
        deleted: {$exists: false},
        status: 'Active',
        storeName: new RegExp(name, 'i')
    };
    return Store.find(query, {_id: 1, storeName: 1})
            .catch(function (err) {
                return Promise.reject(err);
            });
}

exports.addVendors = function (vendorsList, productId) {
    return Product.findOneAndUpdate({_id: productId, deleted: {$exists: false}}, {$addToSet: {vendors: vendorsList}}, {
        new : true,
        runValidators: true
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

exports.removeVendors = function (vendorId, productId) {
    return Product.findOneAndUpdate({_id: productId, deleted: {$exists: false}}, {'$pull': {vendors: {_id: vendorId}}}, {
        new : true,
        runValidators: true
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

exports.addVariants = function (variantsList, productId, categoryId, subcategoryId) {
    var query = {
        deleted: {$exists: false},
        _id: productId,
        "categories._id": categoryId,
        "subcategories._id": subcategoryId
    }
    console.log(variantsList, "variantsList111111111111111")
//    return Product.findOneAndUpdate({ _id: productId, deleted: { $exists: false } }, { $addToSet: { variants: variantsList } }, {
    return Product.findOneAndUpdate(query, {$addToSet: {variants: variantsList}}, {
        new : true,
        runValidators: true
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

exports.removeVariant = function (variantId, productId, categoryId, subcategoryId) {
    var query = {
        deleted: {$exists: false},
        _id: productId,
        "categories._id": categoryId,
        "subcategories._id": subcategoryId
    }
    return Product.findOneAndUpdate(query, {'$pull': {variants: {_id: variantId}}}, {
        new : true,
        runValidators: true
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

exports.updateVariantDetails = function (variantDetails, productId, variantId) {

    return Product.findOneAndUpdate({_id: productId, deleted: {$exists: false}, "variants._id": variantId}, {$set: variantDetails}, {
        new : true,
        runValidators: true
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

exports.viewOffers = function (productId) {
    return Offer.find({product: productId, deleted: {$exists: false}})
            .catch(function (err) {
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

exports.removeOffer = function (productId, offerId) {
    return Offer.findOneAndUpdate({_id: offerId, 'product._id': productId, deleted: false}, {deleted: true}, {
        new : true,
        runValidators: true
    });
};

exports.search = function (searchObj) {
    // return Product.aggregate(
    //     [
    //         {
    //             $lookup: {
    //                 "from": ProductVariant.collection.name,
    //                 "localField": "variants",
    //                 "foreignField": "_id",
    //                 "as": "variants"
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 "from": ProductCategory.collection.name,
    //                 "localField": "categories",
    //                 "foreignField": "_id",
    //                 "as": "categories"
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 "from": ProductLotPrice.collection.name,
    //                 "localField": "lotPricing",
    //                 "foreignField": "_id",
    //                 "as": "lotPricing"
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 "from": Store.collection.name,
    //                 "localField": "vendors",
    //                 "foreignField": "_id",
    //                 "as": "vendors"
    //             }
    //         },
    //         {
    //             $addFields: { id: "$_id" }
    //         },
    //         {
    //             $project: {
    //                 __v: 0,
    //                 _id: 0,
    //                 items: {

    //                 }
    //             }
    //         },
    //         {
    //             $match: {
    //                 $or: [
    //                     { "variants.variantName": { "$in": [searchObj.variantName] } },
    //                     { "variants.variantRetailPrice": { "$in": [searchObj.variantRetailPrice] } },
    //                     { brand: searchObj.brand },
    //                     { manufacturer: searchObj.manufacturer },
    //                     { baseRetailPrice: searchObj.baseRetailPrice }
    //                 ]
    //             }
    //         }

    //     ],
    //     function (err, data) {

    //         // let results = _.map(data, function (p) {
    //         //     p.variants = removeUnwantedKeys(p.variants)
    //         //     p.categories = removeUnwantedKeys(p.categories)
    //         //     p.lotPricing = removeUnwantedKeys(p.lotPricing)
    //         //     p.vendors = removeUnwantedKeys(p.vendors)
    //         //     return p
    //         // })

    //         return Promise.resolve(data)
    //     }
    // ).catch(function (err) {
    //     return Promise.reject(err);
    // });

    return Product.find().then(function (data) {
        return data.aggregate([{
                $match: {
                    $or: [
                        {"variants.variantName": {"$in": [searchObj.variantName]}},
                        {"variants.variantRetailPrice": {"$in": [searchObj.variantRetailPrice]}},
                        {brand: searchObj.brand},
                        {manufacturer: searchObj.manufacturer},
                        {baseRetailPrice: searchObj.baseRetailPrice}
                    ]
                }
            }]).then(function (result) {
            return result
        })
    })

    // return Product.query(searchObj).then(function (data) {
    //     return Promise.resolve(data);
    // })
};

exports.bulkupload = function (products) {
    return Product.insertMany(products)
            .catch(function (err) {
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

exports.productInventory = function (storeId, productId) {
    return ProductInventory.find({"store._id": storeId, "product._id": productId})
};

exports.getProductWithVariant = function (productId, variantId) {
    return Product.findOne({'_id': productId, 'variants._id': variantId}, {productName: 1, shortCode: 1, baseRetailPrice: 1, baseTaxPercent: 1, 'variants.$': 1, store: 1})
            .then(function (data) {
                var output = {
                    product: {
                        _id: data._id,
                        productName: data.productName,
                        shortCode: data.shortCode,
                        baseRetailPrice: data.baseRetailPrice,
                        baseTaxPercent: data.baseTaxPercent
                    }
                }
                output['store'] = data.store.toJSON()
                output['variant'] = data.variants[0].toJSON()
                return output;
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

exports.getProductWithCategoryVariant = function (productId, variantId, categoryId) {
    return Product.find({_id: productId, variants: {_id: variantId}, categories: {_id: categoryId}}, {productName: 1, shortCode: 1, baseRetailPrice: 1, baseTaxPercent: 1, 'variants.$': 1, 'categories.$': 1, store: 1})
            .then(function (data) {
                var output = {
                    product: {
                        _id: data._id,
                        productName: data.productName,
                        shortCode: data.shortCode,
                        baseRetailPrice: data.baseRetailPrice,
                        baseTaxPercent: data.baseTaxPercent
                    }
                }
                output['store'] = data.store
                output['variant'] = data.variants[0]
                output['category'] = data.categories[0]
                return Promise.resolve(output);
            })
};
//exports.trendingProducts = function () {
//    
//    return order.findOneAndUpdate({_id: offerId, 'product._id': productId, deleted: false}, {deleted: true}, {
//        new : true,
//        runValidators: true
//    });
//};
// checking  product is favourite or not
exports.checkFavoriteProduct = function (id, req) {
    const query = {
        deleted: {$exists: false},
    }
    query["product._id"] = id;
    if (req.industry_id) {
        query["industry._id"] = req.industry_id;
    }
    return Favourites.find(query).exec();
}
exports.simillarProducts = function (industryId, category, brand) {

    console.log(industryId, category, "innnnnn")
    var query = {
        "industry._id": industryId,
        $and: [
            {$or: [{"categories._id": category}]},
            {$or: [{brand: brand}]},
//            {$or: [{"industry._id": industryId}]},
            {$or: [{deleted: {$exists: false}}]}
        ]
    }
    console.log(query, "queryyyy")
    return Product.find(query);

//    if (req.categoryName && req.subcategoryName) {
//        var query = {
//            $elemMatch: {
//                categoryName: new RegExp(req.categoryName, 'i'),
//                subcategoryName: new RegExp(req.subcategoryName, 'i')
//            }
//        }
//    if (req.subcategoryName) {
//        query.subcategories = {$elemMatch: {subcategoryName: new RegExp(req.subcategoryName, 'i')}}
//    }
//    if (req.categoryName || req.brand) {
//        var query = {
//            $elemMatch: {
////                category: new RegExp(req.categoryName, 'i'),
//                brand: new RegExp(req.brand, 'i')
//            }
//        };
//    }
//    console.log(query, "queryyyyyyyy")
//    return Product.find(query);

};
