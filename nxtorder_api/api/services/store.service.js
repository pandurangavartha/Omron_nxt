const Promise = require('bluebird');

const Store = require('../models/store.model');
const User = require('../models/user.model');
const ProductCategory = require('../models/product-category.model');
const Product = require('../models/product.model');
const ProductSubCategory = require('../models/product-subcategory.model');
const StoreCategory = require('../models/store-category.model');
const StoreBrand = require('../models/store-brands.model');
const StoreSubCategory = require('../models/store-subcategory.model');
const StoreProducts = require('../models/store-product.model');
const FavouriteStores = require('../models/favourite-stores.model');
const Msg = require('../../config/strings');
const UserService = require('../services/user.service')
const mongoose = require('mongoose');
const _ = require('lodash');
var asyncLoop = require("node-async-loop");

function categories(id, store) {
    var productFinalData = [];
//    console.log(store, "storeeeeeeeeeeeee")
    var query = {
        deleted: {$exists: false},
        "industry._id": id
    }
    return new Promise((resolve, reject) => {
        ProductCategory.find(query).then(function (data) {
//            console.log(data, "dataaaa")
            if (data !== '') {
                var final = [];
//                asyncLoop(data, function (obj, next) {
                asyncLoop(data, function (obj, next) {
                    var query = {
                        "parent_id": obj.parent_id
                    }
                    const obj1 = {
                        "industry": {
                            _id: obj.industry._id,
                            industryName: obj.industry.industryName
                        },
                        "categoryName": obj.categoryName,
                        "shortCode": obj.shortCode,
                        "storeId": store._id,
                        prodctMainCategoryId: obj._id,
                        image: obj.image
                    }
//                    console.log(obj, "objjjjjjjjjjjjjj")
                    if (obj.parent_id === "0") {
//                        console.log("in 000000000000000")
//                        obj1.parent_id = obj.parent_id
//                        console.log(obj1, "onj11111111111")
                        return StoreCategory.create(obj1).then(function (storeCat) {
                            var subCatInId = storeCat._id
                            var prodctInsertedData = {
                                _id: subCatInId,
                                categoryName: storeCat.categoryName,
                            }
                            proquery = {
                                deleted: {$exists: false}
                            }
                            proquery["industry._id"] = id;
                            proquery["categories._id"] = obj._id;
//                            query["subcategories._id"] = sub._id;
                            console.log("queryyyyy2222222222", proquery);
//                            _.each()
                            Product.find(proquery).then(function (productData) {
                                console.log(productData, "in product if 0000000000000")
                                if (productData.length > 0) {
                                    _.each(productData, function (proObj) {
                                        var pData = {
                                            "store": store,
                                            "industry": {
                                                _id: obj.industry._id,
                                                industryName: obj.industry.industryName
                                            },
//                                            "status": proObj.status,
                                            "status": "InActive",
                                            "wholeSaler": proObj.wholeSaler,
                                            "distributor": proObj.distributor,
                                            "isFavourite": proObj.isFavourite,
                                            "features": proObj.features,
                                            "images": proObj.images,
                                            "logo": proObj.logo,
                                            "productName": proObj.productName,
                                            "shortCode": proObj.shortCode,
                                            "description": proObj.description,
                                            "brand": proObj.brand,
                                            "manufacturer": proObj.manufacturer,
                                            "baseRetailPrice": proObj.baseRetailPrice,
                                            "baseTaxPercent": proObj.baseTaxPercent,
                                            "categories": prodctInsertedData,
//                                            "brand": proObj.brand
//                                            "subcategories": prodctInsertedData,
                                        }
                                        if ((store.brands).length > 0) {
                                            var filtered_data = _.filter(store.brands, {_id: proObj.brandId});
                                            if (filtered_data.length > 0) {
                                                pData.brand = proObj.brand;
                                                productFinalData.push(pData)
                                            }
                                        } else {
                                            productFinalData.push(pData)
                                        }
                                        console.log(productFinalData, "productFinalDataproductFinalData")
//                                        return StoreProducts.insertMany(productFinalData).then(function (err, nn) {
//                                            console.log("success")
//                                            next();
//                                        })
                                    })
                                    return StoreProducts.insertMany(productFinalData).then(function (err, nn) {
                                        console.log("success")
                                        next();
                                    })
                                } else {
                                    next();
                                }
                            })
                        })
                    } else {
//                        console.log("in elseeeee", obj.parent_id)
                        var query = {
                            parent_id: obj.parent_id
                        }
                        ProductCategory.find(query).then(function (prodata) {
                            var query1 = {}
                            StoreCategory.find(query1).then(function (subData) {
//                                console.log(subData, "subDatasubData")
                                obj1.parent_id = subData[0]._id;
                                StoreCategory.create(obj1).then(function (storeCat) {
                                    var subCatInId = storeCat._id
                                    var prodctInsertedData = {
                                        _id: subCatInId,
                                        categoryName: storeCat.categoryName
                                    }
                                    var proquery = {
                                        deleted: {$exists: false}
                                    }
                                    proquery["industry._id"] = id;
                                    proquery["categories._id"] = obj._id;
                                    console.log("queryyyyy2222222222", proquery);
                                    Product.find(proquery).then(function (productData) {
                                        console.log(productData, "in product")
                                        if (productData.length > 0) {
                                            _.each(productData, function (proObj) {
                                                var pData = {
                                                    "store": store,
                                                    "industry": {
                                                        _id: obj.industry._id,
                                                        industryName: obj.industry.industryName
                                                    },
                                                    "status": proObj.status,
                                                    "wholeSaler": proObj.wholeSaler,
                                                    "distributor": proObj.distributor,
                                                    "isFavourite": proObj.isFavourite,
                                                    "features": proObj.features,
                                                    "images": proObj.images,
                                                    "logo": proObj.logo,
                                                    "productName": proObj.productName,
                                                    "shortCode": proObj.shortCode,
                                                    "description": proObj.description,
                                                    "brand": proObj.brand,
                                                    "manufacturer": proObj.manufacturer,
                                                    "baseRetailPrice": proObj.baseRetailPrice,
                                                    "baseTaxPercent": proObj.baseTaxPercent,
                                                    "categories": prodctInsertedData,
                                                }
                                                console.log(store.brands, "storesssssssssssss in else ")
                                                if ((store.brands).length > 0) {
                                                    var filtered_data = _.filter(store.brands, {_id: proObj.brandId});
                                                    if (filtered_data.length > 0) {
                                                        pData.brand = proObj.brand;
                                                        productFinalData.push(pData)
                                                    }
                                                } else {
                                                    productFinalData.push(pData)
                                                }
                                                console.log(productFinalData, "productFinalDataproductFinalData")
//                                                productFinalData.push(pData)
//                                                return StoreProducts.insertMany(productFinalData).then(function (err, nn) {
//                                                    console.log("success")
//                                                    next();
//                                                })
                                            })
                                            console.log(productFinalData, 'productFinalDataproductFinalDataproductFinalData')
                                            return StoreProducts.insertMany(productFinalData).then(function (err, nn) {
                                                console.log("success")
                                                next();
                                            })
                                        } else {
                                            next();
                                        }
//                                        next();

                                    })
                                })
                            })
                        })
                    }
                    next();
                }, function (err) {
                    if (err) {
                        console.error('Error: ' + err.message);
                        return;
                    }
                    //            resolve(finalData);
                });
                //            resolve(data);
                resolve(final);
            }
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
    })
}
exports.createBrand = async function (brandObj) {
    return StoreBrand.findOne({
        brandName: brandObj.brandName
    }).exec()
            .then(function (brand) {
                if (brand) {
                    var err = new Error(Msg.STORE_EXISTS);
                    err.status = 409;
                    return Promise.reject(err);
                } else {
                    return StoreBrand.create(brandObj)
                            .then(function (store) {
                                return ({
                                    "msg": "succesfully",
                                    "status": store
                                })
                            }).catch(function (err) {
                        if (err.name === 'ValidationError') {
                            console.log("in erro111")
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
}
exports.create = async function (storeObj) {
    return Store.findOne({
        storeName: storeObj.storeName
    }).exec()
            .then(function (store) {
                if (store !== '') {
                    var id = storeObj.industry['_id'];
                    console.log(id, "iddddd")
                    if (store) {
                        var err = new Error(Msg.STORE_EXISTS);
                        err.status = 409;
                        return Promise.reject(err);
                    }
                    console.log(storeObj, "storeobjjjjjj")
                    //                return Store.create(storeObj);
                    return Store.create(storeObj)
                            .then(function (store) {
                                var store1 = {
                                    "_id": store._id,
                                    "storeName": store.storeName,
                                    brands: store.brands
                                }
                                const cat = categories(id, store1).then(function (data) {
                                    //                                var msg = 
//                                return store
//                                return ({
//                                "msg": "succesfully",
//                                "status": store
//                            })
                                });
                                return ({
                                    "msg": "succesfully",
                                    "status": store
                                })
                            }).catch(function (err) {
                        if (err.name === 'ValidationError') {
                            console.log("in erro111")
                            var err1 = new Error(err.message);
                            err1.status = 400;
                            return Promise.reject(err1);
                        }
                        var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
                        err2.status = 500;
                        return Promise.reject(err2);
                    });
                    if (store && store.status === 'InActive') {
                        var err = new Error(Msg.STORE_DEACTIVATED);
                        err.status = 204;
                        return Promise.reject(err);
                    }
                }
            })
};

exports.update = function (store, storeId) {
    console.log(store, "stoeee")
    return Store.findOneAndUpdate({_id: storeId, status: 'Active', deleted: {$exists: false}}, store, {
        new : true,
        runValidators: true
    });
};

exports.view = function (storeId) {
    return Store.findOne({_id: storeId, status: 'Active', deleted: {$exists: false}});
};

exports.deactivate = function (storeId) {
    return Store.findOneAndUpdate({_id: storeId, status: 'Active', deleted: {$exists: false}}, {status: "InActive"}, {
        new : true,
        runValidators: true
    });
};

exports.addEmployees = function (userObj, storeId) {
    var storeObj = {}
    return Store.findById({_id: storeId, status: 'Active', deleted: {$exists: false}})
            .then(function (store) {
                if (!store) {
                    return Promise.reject(new Error(Msg.STORE_NOT_EXISTS));
                }
                ;
                return store
            }).then(function (store) {
        storeObj._id = store._id
        storeObj.storeName = store.storeName
        return User.findOne({username: userObj.username})
    }).then(function (user) {
        if (!user) {
            userObj.store = storeObj
            userObj.roles = ["Customer", "Employee"]
            return User.create(userObj)
        } else {
            return User.findByIdAndUpdate({_id: user._id}, {$addToSet: {roles: "Employee"}}, {
                new : true,
                runValidators: true
            })
        }
    }).then(function (user) {
        var employee = {
            _id: user._id,
            name: user.name,
            username: user.username
        }
        return Store.findByIdAndUpdate(storeId, {$addToSet: {employees: employee}}, {
            new : true,
            runValidators: true
        });
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

exports.removeEmployees = function (employeeId, storeId) {
    return Store.findById({_id: storeId, status: 'Active', deleted: {$exists: false}})
            .then(function (store) {

                if (!store) {
                    return Promise.reject(new Error(Msg.STORE_NOT_EXISTS));
                }

                if (!store.employees) {
                    var err2 = new Error(Msg.EMPLOYEES_MISSING);
                    err2.status = 204;
                    return Promise.reject(err2);
                }

                User.findByIdAndUpdate(employeeId, {'$pull': {roles: "Employee"}}, {
                    new : true,
                    runValidators: true
                }).then(function (user) {
                    console.log(user)
                })

                return Store.findByIdAndUpdate(storeId, {'$pull': {employees: {_id: employeeId}}}, {
                    new : true,
                    runValidators: true
                })

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

exports.viewEmployees = function (storeId) {
    return Store.findById({_id: storeId, status: 'Active', deleted: {$exists: false}})
            .then(function (store) {
                return Promise.resolve(store.employees);
            }).catch(function (err) {
        return Promise.reject(err);
    });
};

exports.activate = function (storeId) {
    return Store.findByIdAndUpdate({_id: storeId, status: 'InActive', deleted: {$exists: false}}, {status: "Active"}, {
        new : true,
        runValidators: true
    });
};

exports.getAll = function (req) {

    var query = {
        deleted: {$exists: false},
        status: "Active"

    };

    if (req.status) {
        query.status = req.status
    }

    if (req.lat && req.lng) {
        query.location = {$nearSphere: {$geometry: {type: "Point", coordinates: [req.lng, req.lat]}, $maxDistance: 5}} //5 mile = 8000 m approx
//        query.location = { $nearSphere: { $geometry: { type: "Point", coordinates: [req.lng, req.lat] } } } //5 mile = 8000 m approx
    }
//    else {
//        console.log('in 11111111111')
//        query.location = {$geoWithin: {
//                $geometry: {
//                    type: "Polygon",
//                    coordinates: [[[0, 0], [3, 6], [6, 1], [0, 0]]],
//                    $maxDistance: 5
//                }
//            }}
//    }
    if (req.isBulkOrdersAccept) {
        query.isBulkOrdersAccept = req.isBulkOrdersAccept
    }
    if (req.industry_id) {
        query = {
            "industry._id": req.industry_id
        }
    }
    if (req.industry_id && req.isBulkOrdersAccept) {
        query = {
            "industry._id": req.industry_id,
            isBulkOrdersAccept: req.isBulkOrdersAccept
        }
    }
    if (req.storeName) {
        query.storeName = new RegExp(req.storeName, 'i')
    }
    if (req.type == "near") {
        query = {
//            "industry._id": req.industry_id,
            "location": {$geoWithin: {
                    $geometry: {
                        type: "Polygon",
                        coordinates: [[[0, 0], [3, 6], [6, 1], [0, 0]]],
                        $maxDistance: 5
                    }
                }}
        }
    }
    // industrywise stores near you    
    if ((req.type == "near" && req.industry_id)) {
        console.log('in 22222222')
//    if ((req.industry_id && req.type == "near") ||  (req.type == "near" && req.industry_id))  {
        query = {
            "industry._id": req.industry_id,
            "location": {$geoWithin: {
                    $geometry: {
                        type: "Polygon",
                        coordinates: [[[0, 0], [3, 6], [6, 1], [0, 0]]],
                        $maxDistance: 5
                    }
                }}
        }
    }

    console.log(query, 'query')
    return Store.find(query).sort({storeName: 1}).then(function (data) {
        return Promise.resolve(data);
    }).catch(function (err) {
        return Promise.reject(err);
    });
};

exports.getStoreCategories = function (storeId) {

    var query = {
//        deleted: {$exists: fal    se},
        "storeId": storeId

    };
    console.log(query, "qqqqqq")
//    return Store.find(query).sort({storeName: 1}).then(function (data) {
    return StoreCategory.find(query).then(function (data) {
        console.log(data, "dataaaaa")
        return Promise.resolve(data);
    }).catch(function (err) {
        return Promise.reject(err);
    });
};
// subcategories
//getSubStoreCategories
exports.getSubStoreCategories = function (storeId, catId) {

    var query = {
//        deleted: {$exists: fal    se},
//        "store._id": storeId,
        "productCategory._id": catId,

    };
    console.log(query, "qqqqqq")
//    return Store.find(query).sort({storeName: 1}).then(function (data) {
    return StoreSubCategory.find(query).then(function (data) {
        console.log(data, "dataaaaa")
        return Promise.resolve(data);
    }).catch(function (err) {
        return Promise.reject(err);
    });
};
exports.geCategoryWiseStores = function (categoryId) {

    var query = {
//        deleted: {$exists: fal    se},
        "prodctMainCategoryId": categoryId
    };
    console.log(query, "qqqqqq")
//    return Store.find(query).sort({storeName: 1}).then(function (data) {
    return StoreCategory.find(query).then(function (data) {
        console.log(data, "dataaaaa")
        return Promise.resolve(data);
    }).catch(function (err) {
        return Promise.reject(err);
    });
};
//  product details
exports.storeDetails = function (id, req) {
    var query = {
        "_id": id,
//        "industry._id":req.industry_id
    }
    if (req.industry_id) {
        query["industry._id"] = req.industry_id
    }
    return Store.findById(query, function (err, data) {
//        return
        console.log(data, "dataaaa");
        return data
    });
}
exports.checkFavoriteStore = function (id) {
    const query = {
        deleted: {$exists: false},
    }
    query["store._id"] = id;
    return FavouriteStores.find(query).exec();
}








//function categories(id, store) {
//    console.log(id, store, "idddd1111111111111111111111111111111")
//    var productFinalData = [];
//    var query = {
//        deleted: {
//            $exists: false
//        },
//        "industry._id": id
//    }
//    return new Promise((resolve, reject) => {
//        ProductCategory.find(query).then(function (data) {
//            console.log(data, "dataaaa")
//            if (data !== '') {
//                var final = [];
////                asyncLoop(data, function (obj, next) {
//                asyncLoop(data, function (obj, next) {
//                    const obj1 = {
//                        "industry": {
//                            _id: obj.industry._id,
//                            industryName: obj.industry.industryName
//                        },
//                        "categoryName": obj.categoryName,
//                        "shortCode": obj.shortCode,
//                        "store": store,
//                        prodctMainCategoryId: obj._id
//
//                    }
//                    console.log(obj1, "obj1obj1")
//                    return StoreCategory.create(obj1)
//                            .then(function (storeCat) {
//                                var inCatId = storeCat._id;
//                                var productCategory = {
//                                    _id: inCatId,
//                                    categoryName: storeCat.categoryName
//                                }
//                                query = {
//                                    deleted: {
//                                        $exists: false
//                                    }
//                                },
//                                        query['productCategory._id'] = obj._id;
//                                ProductSubCategory.find(query).then(function (subdata) {
////                                    _.each(subdata, function (sub, next) {
//                                    asyncLoop(subdata, function (sub, next) {
//                                        var sucatgeoryData = {
//                                            subCategoryName: sub.subCategoryName,
//                                            shortCode: sub.shortCode,
//                                            productCategory: productCategory,
//                                            prodctMainCategoryId: obj._id,
//                                            prodctMainSubCategoryId: obj1._id,
//                                        }
//                                        //                                    console.log(sucatgeoryData,"sucatgeoryDatasucatgeoryDatasucatgeoryData")
//                                        return StoreSubCategory.create(sucatgeoryData).then(function (storeSubCat) {
//                                            //                                        console.log(storeSubCat, "sttoreSubCatstoreSubCat")
//                                            query = {
//                                                deleted: {
//                                                    $exists: false
//                                                }
//                                            }
//                                            query["industry._id"] = id;
//                                            query["categories._id"] = obj._id;
//                                            query["subcategories._id"] = sub._id;
//                                            console.log("queryyyyy2222222222", query);
//
//                                            Product.find(query).then(function (productData) {
//                                                console.log(productData, "product dataaaaaaaaa")
//                                                var subCatInId = storeSubCat._id
//                                                var prodctInsertedData = {
//                                                    _id: subCatInId,
//                                                    subcategoryName: storeSubCat.subCategoryName
//                                                }
//                                                //  asyncLoop(productData, function (proObj, next) {
//                                                _.each(productData, function (proObj) {
//                                                    var pData = {
//                                                        "store": store,
//                                                        "industry": {
//                                                            _id: obj.industry._id,
//                                                            industryName: obj.industry.industryName
//                                                        },
//                                                        "status": proObj.status,
//                                                        "wholeSaler": proObj.wholeSaler,
//                                                        "distributor": proObj.distributor,
//                                                        "isFavourite": proObj.isFavourite,
//                                                        "features": proObj.features,
//                                                        "images": proObj.images,
//                                                        "logo": proObj.logo,
//                                                        "productName": proObj.productName,
//                                                        "shortCode": proObj.shortCode,
//                                                        "description": proObj.description,
//                                                        "brand": proObj.brand,
//                                                        "manufacturer": proObj.manufacturer,
//                                                        "baseRetailPrice": proObj.baseRetailPrice,
//                                                        "baseTaxPercent": proObj.baseTaxPercent,
//                                                        "categories": productCategory,
//                                                        "subcategories": prodctInsertedData,
//                                                        //                                                            "variants": proObj,
//                                                        //                                                            "vendors": proObj[],
//                                                    }
//                                                    productFinalData.push(pData)
////                                                    return StoreProducts.insertMany(productFinalData)
////                                                            .then(function (err, nn) {
////                                                                console.log("success")
////                                                                //                                                            
////                                                            })
//                                                })
//                                                return StoreProducts.insertMany(productFinalData)
//                                                        .then(function (err, nn) {
//                                                            console.log("success")
//                                                            //                                                            
//                                                        })
//                                            })
//                                            next();
//                                        })
//
//                                    })
//                                })
//                                next();
//                            });
//
//                }, function (err) {
//                    if (err) {
//                        console.error('Error: ' + err.message);
//                        return;
//                    }
//
//                    console.log('Finished!', finalData);
//                    //            resolve(finalData);
//                });
//                //            console.log(data, "dataaaaaaaa")
//                //            resolve(data);
//                resolve(final);
//            }
//        }).catch(function (err) {
//            if (err.name === 'ValidationError') {
//                var err1 = new Error(err.message);
//                err1.status = 400;
//                return Promise.reject(err1);
//            }
//            var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
//            err2.status = 500;
//            return Promise.reject(err2);
//        });
//    })
//}