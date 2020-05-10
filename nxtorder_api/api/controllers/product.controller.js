const ProductService = require('../services/product.service');
const Msg = require('../../config/strings');
const shortid = require('shortid');
const mongoXlsx = require('mongo-xlsx');
const _ = require('lodash');
const multiparty = require('multiparty');
const fs = require('fs');
var asyncLoop = require("node-async-loop");
exports.register = function (req, res, next) {
    var form = new multiparty.Form();
    var productObj = req.body;
    var images = [];
    console.log(productObj, "productObjproductObj");
//   var form = new multiparty.Form();
//return false;
    var imageName;
    form.parse(req, function (err, fileds, files) {
        console.log(files, "filesfiles")
        var input = {};
        if (_.size(files) > 0) {
            if (files.logo) {
                var destinationPath = './public/uploads/' + files.logo[0].originalFilename;
                var tmpPath = files.logo[0].path
                fs.readFile(tmpPath, function (err, data) {
                    fs.writeFile(destinationPath, data, function (err) {
                        if (err) {
                            console.error(err.stack, "error");
                        }
                    });
                });
                input.logo = '/public/uploads/' + files.logo[0].originalFilename;
            }
            if (files.image) {
                var destinationPath = './public/bulkuploads/' + files.image[0].originalFilename;
                var tmpPath = files.image[0].path;
                var imagesName = []
                for (var i = 0; i < _.size(files.image); i++) {
                    var tmpPath = files.image[i].path;
                    //var targetPath = './public/uploads/' + files.scopedocument[i].originalFilename;
                    var destinationPath = './public/bulkuploads/' + files.image[i].originalFilename;
                    fs.renameSync(tmpPath, destinationPath, function (err) {
                        if (err)
                            res.status(500).send({
                                status: "-1",
                                message: "Error in file Uploading !"
                            })
                    });
                    var scope = {
                        name: '/public/bulkuploads/' + files.image[i].originalFilename
                    }
                    imagesName.push(scope);
                    fs.readFile(tmpPath, function (err, data) {
                        fs.writeFile(destinationPath, data, function (err) {
                            if (err) {
                                console.error(err.stack, "error");
                            }
                        });
                    });
                    input.image = files.image[0].originalFilename;
                }

            }
        }

        input.images = imagesName;
        if (_.size(fileds)) {
            Object.keys(fileds).forEach(function (filedName) {
                input[filedName] = fileds[filedName][0]
            });
        }

        if (input) {
            const img = [];
            _.each(input.images, function (obj) {
                img.push(obj.name)
            })
            input.images = img;
//            console.log(input.'categories[0][_id]',"innnnnnnnnnnnnn")
            var productObj = input;
            console.log(input, "inputtt")
//            var categories = {
//                "_id": input.categories_id,
//                "categoryName": input.categories_categoryName,
//                "shortCode": input.categories_shortCode,
//            }
            var categories = {
                "_id": input['categories[0][_id]'],
                "categoryName": input['categories[0][categoryName]'],
                "shortCode": input['categories[0][shortCode]'],
//                "shortCode": input['categories[0][shortCode]'],
            }
            console.log(categories, "categories")
//            var subcategories = {
//                "_id": input['subcategories[0][_id]'],
//                "subcategoryName": input['subcategories[0][subcategoryName]'],
//                "shortCode": input['subcategories[0][shortCode]'],
//            }
            var industry = {
                "_id": input['industry[0][_id]'],
                "industryName": input['industry[0][industryName]'],
            }
            productObj.categories = categories;
//            productObj.subcategories = subcategories;
            productObj.industry = industry;
            console.log(productObj, 'productObj1111111111111')
//            return false;
            ProductService.create(productObj).then(function (product) {
                return res.send({result: product});
            }).catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            });
        }
    });

};
//exports.register = function (req, res, next) {
//    
//    var productObj = req.body;
//    var images=[];
//    console.log(productObj.logo, "productObjproductObj");
////    return false;
//    if (req.file) {
//        if (productObj.logo) {
//            productObj.logo = req.file.path
//        } 
////        console.log(productObj.image, 'productObj.image')
////        return false;
////        if(productObj.image.length > 0){
////            _.each( productObj.image, function(obj){
////                console.log(obj.image.path, "obj.image.path")
////                var object ={
////                    image:obj.image.path
////                }
////                console.log(object, "objectobjectobject")
////                images.push(object)
////            })
////           productObj.images= images
////        }
//
//    }
////    console.log(productObj, 'productObjproductObj')
//    ProductService.create(productObj, req.params.store_id).then(function (product) {
//        return res.send({result: product});
//    }).catch(function (err) {
//        return res.status(400).send({result: {error: err.message}})
//    });
//};

exports.update = function (req, res, next) {
    var product = req.body
    if (req.file) {
        product.logo = req.file.path
    }

    delete product.store;
    //TODO: if we allow product name update, need to update all the references with new name
    delete product.productName;
    delete product.shortCode;
    delete product.status;
    delete product.vendors;
    delete product.variants;
    ProductService.update(product, req.params.product_id)
            .then(function (product) {
                return res.send({result: product});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};
exports.view = function (req, res, next) {
    ProductService.view(req.params.product_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
// get products by selected sub catebory wise
exports.products = function (req, res, next) {
    ProductService.products(req.params.subCategory_id).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
exports.deactivate = function (req, res, next) {
    ProductService.deactivate(req.params.product_id)
            .then(function (store) {
                return res.status(200).send({result: {error: Msg.STORE_DEACTIVATED}})
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};
exports.activate = function (req, res, next) {
    ProductService.activate(req.params.product_id)
            .then(function (store) {
                return res.send({result: store});
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};
exports.delete = function (req, res, next) {
    ProductService.delete(req.params.product_id).then(function (product) {
        return res.send({result: product});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
exports.all = function (req, res, next) {
    ProductService.getAll(req.params.store_id, req.query).then(function (data) {
        var array = [];
        asyncLoop(data, function (obj, next) {
            console.log(obj._id, "obj._id")

            ProductService.checkFavoriteProduct(obj._id).then(function (data1) {
//                console.log(data1, "datassss111111111")
                var newObj;
                if (data1.length > 0) {
//                    console.log("innnnnnnnnnn nooo")
                    newObj = obj
                    newObj.isFavourite = true;
                    array.push(newObj)
                } else {
//                    console.log("innnnnnnnnnn yessssssssss")
                    newObj = obj
                    newObj.isFavourite = false;
                    array.push(newObj)
                }
//                console.log(newObj, "objjjjjjjjjj")
                array.push(obj)
                next()
            })

        }, function () {
            return res.send({result: array})
        })
//        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}
// new arrivals
exports.newArrivals = function (req, res, next) {
    ProductService.newArrivals(req.query).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}
// Products industrywise
exports.industryWise = function (req, res, next) {
    console.log("innnnnnnnnnnnnnnnnnnnnnnnn", req.headers);
    if (req.headers['x-header-authtoken']) {
//        console.log("in headerr")
        ProductService.industryWise(req).then(function (data) {
            var array = [];
            var isFavourite = false;
            var newObj;
            asyncLoop(data, function (obj, next) {
                console.log(obj._id, "obj._id")

                ProductService.checkFavoriteProduct(obj._id).then(function (data1) {
//                console.log(data1, "datassss111111111")
                    var newObj;
                    if (data1.length > 0) {
//                    console.log("innnnnnnnnnn nooo")
                        newObj = obj
                        newObj.isFavourite = true;
                        array.push(newObj)
                    } else {
//                    console.log("innnnnnnnnnn yessssssssss")
                        newObj = obj
                        newObj.isFavourite = false;
                        array.push(newObj)
                    }
//                console.log(newObj, "objjjjjjjjjj")
                    array.push(obj)
                    next()
                })

            }, function () {
                return res.send({result: data})
            })

//        return res.send({result: data})
        }).catch(function (err) {
            return res.status(400).send({result: {error: err.message}})
        });
    } else {
        ProductService.industryWise(req).then(function (data) {
            var array = [];
//        var isFavourite= false;
//        var newObj;
            asyncLoop(data, function (obj, next) {
                console.log(obj._id, "obj._id")
                ProductService.checkFavoriteProduct(obj._id).then(function (data1) {
                    array.push(obj)
                    next()
                })
            }, function () {
                return res.send({result: array})
            })

//        return res.send({result: data})
        }).catch(function (err) {
            return res.status(400).send({result: {error: err.message}})
        });
    }

}
exports.singleSubcategory = function (req, res, next) {
    console.log("innnnnnnnnnnnnnnn");
    ProductService.singleSubcategory(req.params.industry_id, req.params.category_id,
            req.params.subcategory_id, req.query).then(function (data) {
        return res.send({result: data})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
}
exports.vendors = function (req, res, next) {
    ProductService.vendors(req.params.product_id)
            .then(function (vendors) {
                return res.send({result: vendors});
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
exports.searchVendors = function (req, res, next) {
    ProductService.searchVendor(req.query.storeName)
            .then(function (data) {
                return res.send({result: data});
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
exports.vendorsProducts = function (req, res, next) {
    ProductService.vendorsProducts(req.params.store_id)
            .then(function (data) {
                return res.send({result: data});
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
exports.addVendors = function (req, res, next) {

    var vendorObj = {};
    vendorObj._id = req.body._id;
    vendorObj.storeName = req.body.storeName

    ProductService.addVendors(vendorObj, req.params.product_id).then(function (product) {
        return res.send({result: product})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
exports.removeVendors = function (req, res, next) {

    ProductService.removeVendors(req.params.vendor_id, req.params.product_id).then(function (product) {
        return res.send({result: product})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
exports.addVariant = function (req, res, next) {
    var variantObj = {}
    variantObj._id = shortid.generate()
    variantObj.variantName = req.body.variantName
    variantObj.variantRetailPrice = req.body.variantRetailPrice
    variantObj.variantTaxPercent = req.body.variantTaxPercent
    variantObj.features = req.body.features
    variantObj.specifications = req.body.specifications

    if (req.files) {
        var images = [];
        for (file in req.files) {
            images.push(req.files[file].path)
        }
        variantObj.images = images
    }

    ProductService.addVariants(variantObj, req.params.product_id, req.params.category_id, req.params.subcategory_id).then(function (product) {
        console.log(product, "productssssssssssss")
        return res.send({result: product})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
exports.removeVariant = function (req, res, next) {
    ProductService.removeVariant(req.params.variant_id, req.params.product_id).then(function (product) {
        return res.send({result: product})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
exports.updateVariantDetails = function (req, res, next) {

    var variantObj = {}

    if (req.body.variantName) {
        variantObj["variants.$.variantName"] = req.body.variantName
    }

    if (req.body.variantRetailPrice) {
        variantObj["variants.$.variantRetailPrice"] = req.body.variantRetailPrice
    }

    if (req.body.variantTaxPercent) {
        variantObj["variants.$.variantTaxPercent"] = req.body.variantTaxPercent
    }

    if (req.body.features) {
        variantObj["variants.$.features"] = req.body.features
    }

    if (req.body.specifications) {
        variantObj["variants.$.specifications"] = req.body.specifications
    }

    if (req.files) {
        var images = [];
        for (file in req.files) {
            images.push(req.files[file].path)
        }
        variantObj["variants.$.images"] = images
    }

    ProductService.updateVariantDetails(variantObj, req.params.product_id, req.params.variant_id).then(function (product) {
        return res.send({result: product})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
exports.bulkupload = function (req, res, next) {

    if (!req.file) {
        return res.status(400).send({result: {error: Msg.FILE_MISSING}})
    }

    mongoXlsx.xlsx2MongoData(req.file.path, null, function (err, data) {
        ProductService.bulkupload(data).then(function (products) {
            return res.send({result: products})
        }).catch(function (err) {
            return res.status(400).send({result: {error: err.message}})
        })
    });
};
exports.productInventory = function (req, res, next) {
    ProductService.productInventory(req.params.store_id, req.params.product_id)
            .then(function (data) {
                return res.send({result: data});
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
exports.trendingProducts = function (req, res, next) {
    ProductService.trendingProducts(req.params.store_id, req.params.product_id)
            .then(function (data) {
                return res.send({result: data});
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
exports.simillarProducts = function (req, res, next) {
    console.log(req.params.industry_id, "req.params.industry_id")
    ProductService.simillarProducts(req.params.industry_id, req.params.category_id, req.params.brandName)
            .then(function (data) {
                console.log(data, "dataaaaaaaa")
                return res.send({result: data});
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};

