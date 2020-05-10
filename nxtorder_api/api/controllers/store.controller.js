const StoreService = require('../services/store.service');
//const StoreBrandService = require('../services/store-brands.service');
const Msg = require('../../config/strings');
const _ = require('lodash');


const asyncLoop = require("node-async-loop");

exports.register = function (req, res, next) {
    var storeObj = req.body;
//     storeObj = {
//        storeName: req.body.storeName,
//        branchName: req.body.branchName,

    var address = {
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        zipcode: req.body.zipcode
    }
    storeObj.address = address
    //TODO: check wether the requested user is owner or not.
//        owner: req.body.owner,
//        industry: req.body.industry,
    storeObj.status = 'Pending Approval';
    storeObj.location = [req.body.longitude, req.body.latitude];
//        gstin: req.body.gstin,
//        openingHours: req.body.openingHours,
//        workingDays: req.body.workingDays,
//        isBulkOrdersAccept: req.body.isBulkOrdersAccept,
//        storeMobile: req.body.storeMobile,
//        storeLandline: req.body.storeLandline,


//console.log(req.body.brands, "brandssss")
    if (req.body.brands) {
        storeObj.brands = JSON.parse(req.body.brands)
    }
    if (req.file) {
        storeObj.logo = req.file.path
    }

    StoreService.create(storeObj).then(function (store) {
        if (store) {
            return res.send({result: store});
        } else {
            return res.status(400).send({result: {error: Msg.INDUSTRY_CREATION_FAILED}})
        }
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//createBrand
exports.createBrand = function (req, res, next) {
    var brandObj = req.body;
//    console.log(req.body.brands, "brandssss")
    if (req.file) {
        brandObj.logo = req.file.path
    }
    StoreService.createBrand(brandObj).then(function (store) {
        if (store) {
            return res.send({result: store});
        } else {
            return res.status(400).send({result: {error: Msg.INDUSTRY_CREATION_FAILED}})
        }
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
exports.update = function (req, res, next) {

    var store = {};

    //TODO: if we allow product name update, need to update all the references with new name
    if (req.body.branchName) {
        store.branchName = req.body.branchName
    }

    //TODO: if we allow product name update, need to update all the references with new name
    if (req.body.storeName) {
        store.storeName = req.body.storeName
    }

    var addressObj = {};

    if (req.body.line1) {
        addressObj.line1 = req.body.line1
    }

    if (req.body.line2) {
        addressObj.line2 = req.body.line2
    }

    if (req.body.city) {
        addressObj.city = req.body.city
    }

    if (req.body.state) {
        addressObj.state = req.body.state
    }

    if (req.body.country) {
        addressObj.country = req.body.country
    }

    if (req.body.zipcode) {
        addressObj.zipcode = req.body.zipcode
    }

    store.address = addressObj

    if (req.body.gstin) {
        store.gstin = req.body.gstin
    }

    if (req.body.openingHours) {
        store.openingHours = req.body.openingHours
    }

    if (req.body.workingDays) {
        store.workingDays = req.body.workingDays
    }
    if (req.body.storeMobile) {
        store.storeMobile = req.body.storeMobile
    }
    if (req.body.storeLandline) {
        store.storeLandline = req.body.storeLandline
    }

    if (req.body.longitude && req.body.latitude) {
        store.location = [req.body.longitude, req.body.latitude]
    }

    if (req.file) {
        store.logo = req.file.path
    }
    if (req.body.isBulkOrdersAccept) {
        store.isBulkOrdersAccept = req.body.isBulkOrdersAccept
    }

    delete store.employees
    delete store.status;

    StoreService.update(store, req.params.store_id)
            .then(function (store) {
                if (store) {
                    return res.send({result: store});
                } else {
                    return res.status(400).send({result: {error: Msg.STORE_NOT_EXISTS}})
                }
            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.addEmployee = function (req, res, next) {

    var employee = {};
    employee.username = req.body.username;
    employee.firstName = req.body.firstName;
    employee.lastName = req.body.lastName;
    employee.password = req.body.password;
    employee.roles = ["Employee"]
    employee.status = 'Active'

    if (req.file) {
        employee.profilePicture = req.file.path
    }

    StoreService.addEmployees(employee, req.params.store_id).then(function (store) {
        if (store) {
            return res.status(200).send({result: store})
        } else {
            return res.status(400).send({result: {error: Msg.STORE_NOT_EXISTS}})
        }

    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};

exports.removeEmployees = function (req, res, next) {
    StoreService.removeEmployees(req.params.employee_id, req.params.store_id)
            .then(function (store) {
                if (store) {
                    return res.status(200).send({result: store})
                } else {
                    return res.status(400).send({result: {error: Msg.STORE_NOT_EXISTS}})
                }

            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};

exports.viewEmployees = function (req, res, next) {
    StoreService.viewEmployees(req.params.store_id)
            .then(function (employees) {
                if (employees) {
                    return res.status(200).send({result: employees})
                } else {
                    return res.status(400).send({result: {error: Msg.EMPLOYEES_MISSING}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};

exports.deactivate = function (req, res, next) {
    StoreService.deactivate(req.params.store_id)
            .then(function (store) {
                if (store) {
                    return res.status(200).send({result: {error: Msg.STORE_DEACTIVATED}})
                } else {
                    return res.status(400).send({result: {error: Msg.STORE_NOT_EXISTS}})
                }

            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.activate = function (req, res, next) {
    StoreService.activate(req.params.store_id)
            .then(function (store, err) {
                if (store) {
                    return res.send({result: store});
                } else {
                    return res.status(400).send({result: {error: Msg.STORE_NOT_EXISTS}})
                }

            })
            .catch(function (err) {
                return res.status(400).send({result: {error: err.message}})
            })
};

exports.view = function (req, res, next) {
    StoreService.view(req.params.store_id).then(function (data) {
        if (data) {
            return res.send({result: data})
        } else {
            return res.status(400).send({result: {error: Msg.STORE_NOT_EXISTS}})
        }
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.getAll = function (req, res, next) {

    StoreService.getAll(req.query)
            .then(function (data) {
                if (data) {
                    return res.send({result: data})
                } else {
                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//getStoreCategories
//
exports.getCategories = function (req, res, next) {

    StoreService.getStoreCategories(req.params.store_id)
            .then(function (data) {
                if (data) {
                    return res.send({result: data})
                } else {
                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

// get subactegories
exports.getSubCategories = function (req, res, next) {

    StoreService.getSubStoreCategories(req.params.store_id, req.params.storecategory_id)
            .then(function (data) {
                if (data) {
                    return res.send({result: data})
                } else {
                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//geCategoryWiseStores
exports.getCategorywiseStores = function (req, res, next) {

    StoreService.geCategoryWiseStores(req.params.category_id)
            .then(function (data) {
                if (data.length > 0) {
                    var array = [];
                    var count = 0;
                    asyncLoop(data, function (obj, next) {
                        console.log(obj._id, "obj._id")
                        var storeId = obj.store;
                        console.log(storeId, "storeeee")
                        StoreService.storeDetails(storeId._id, req.query).then(function (data1) {
                            console.log(data1, "data1111")
                            array.push(data1)
                            count++;

                            if (data.length == count) {
                                console.log(array, 'finalDatasssssssssssss')
//                        resolve(array)
                                return res.send({result: array})

                            }

                            next();
                        })

                    }, function () {
                        console.log(array, "222222222222222")

//                return res.send({result: array})
                    })
//                    return res.send({result: data})
                } else {
                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
//// get all stores based on industrywise
//exports.getAllIndustrywise = function (req, res, next) {
//    var isBulkOrdersAccept;
//    if(req.body.isBulkOrdersAccept) {
//        isBulkOrdersAccept = isBulkOrdersAccept
//    }
//    StoreService.getAllStores(isBulkOrdersAccept, req.params.industry_id)
//            .then(function (data) {
//                if (data) {
//                    return res.send({result: data})
//                } else {
//                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
//                }
//            }).catch(function (err) {
//        return res.status(400).send({result: {error: err.message}})
//    });
//};