const Promise = require('bluebird');
const NeedHelp = require('../models/need-help.model');
const Msg = require('../../config/strings');
exports.register = function (helpObj) {
    console.log(helpObj, "jjjjjjjjjj")
    return NeedHelp.findOne({
        topicname: helpObj.topicname
    }).exec()
            .then(function (help) {
                if (help) {
                    var exists = "topic name already exists."
                    var err = new Error(exists);
                    err.status = 409;
                    return Promise.reject(err);
                }
                console.log(helpObj, "helppppp")
                return NeedHelp.create(helpObj)
                        .then(function (help) {
                            return Promise.resolve(help);
                        }).catch(function (err) {
                    console.log(err, "errr")
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
};

exports.view = function (helpId) {
    return NeedHelp.findById(helpId).exec().then(function (data) {
        return Promise.resolve(data)
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};
exports.update = function (help, helpId) {
    return NeedHelp.findOne({
        "_id": helpId,
    }).exec().then(function (helpData) {
        return NeedHelp.findByIdAndUpdate(helpId, help, {
            new : true,
            runValidators: true
        }).catch(function (err) {
            console.error(err);
            return Promise.reject(err);
        });
    })
};

exports.all = function (req) {

    var query = {
        deleted: {$exists: false}
    };
    if (req.status) {
        query.status = req.status
    }
    console.log(req, "reqqqqqqq")
    if (req.industry_id) {
//        query["industry_id"] = req.industry_id
        query.industry = {
            "_id": req.industry_id
        }
    }

//    if (req.lastName) {
//        query.lastName = new RegExp(req.lastName, 'i')
//    }
    console.log(query, 'queryyyyy')
    return NeedHelp.find(query).then(function (help) {
        console.log(help, 'helppppp')

        return help
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    })
};

exports.topicissues = (helpId) => {
    console.log(helpId, "userIduserIduserId")
    var query = {
        "_id": helpId,
    }
    return NeedHelp.findById(helpId).exec().then(function (data) {
        console.log(data, "dataaaaaaa")
        return Promise.resolve(data)
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};
exports.getIndividualHelp = (helpId, issueId) => {
    console.log(helpId, "userIduserIduserId")
    var query = {
        "_id": helpId,
        "topicissues._id": issueId,
    }
    return NeedHelp.findById(query).exec().then(function (data) {
        console.log(data, "dataaaaaaa")
        return Promise.resolve(data)
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};
exports.addNewAddress = (userObj, userId) => {
    var query = {
        deleted: {$exists: false},
        _id: userId,
//        "categories._id": categoryId,
//        "subcategories._id": subcategoryId
    }
//    return Product.findOneAndUpdate({ _id: productId, deleted: { $exists: false } }, { $addToSet: { variants: variantsList } }, {
    return User.findOneAndUpdate(query, {$addToSet: {addresses: userObj}}, {
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
exports.deleteAddress = function (addressId, userId) {
    var query = {
//        deleted: {$exists: false},
        _id: userId,
        "addresses._id": addressId,
    }
    return User.findOneAndUpdate(query, {'$pull': {addresses: {_id: addressId}}}, {
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
exports.updateAddressDetails = function (addressDetails, userId, addressId) {
    console.log("innnnnnnn", addressDetails)
    return User.findOneAndUpdate(
            {_id: userId,
                deleted: {$exists: false},
                "addresses._id": addressId},
            {$set: addressDetails}, {
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
