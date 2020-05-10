const Promise = require('bluebird');

const OptionType = require('../models/option-type.model');
const OptionValues = require('../models/option-values.model');
const Msg = require('../../config/strings');

exports.createType = function (typeObj) {
    return OptionType.findOne({
        type: typeObj.type
    }).exec()
            .then(function (data) {
                if (data) {
                    var err = new Error(Msg.CATEGORY_EXISTS);
                    err.status = 409;
                    return Promise.reject(err);
                }
                console.log(typeObj);
                return OptionType.create(typeObj)
                        .then(function (data) {
                            return Promise.resolve(data);
                            ;
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
};

exports.update = function (blogCategory, blogCategoryId) {
    return OptionType.findByIdAndUpdate(blogCategoryId, blogCategory, {
        new : true,
        runValidators: true
    });
};

exports.view = function (blogCategoryId) {
    return OptionType.findById(blogCategoryId);
};

exports.delete = function (blogCategoryId) {
    return OptionType.findByIdAndUpdate(blogCategoryId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};

exports.getAll = function () {
    return OptionType.find({deleted: {$exists: false}}).then(function (data) {
        return Promise.resolve(data);
    });
};


exports.createValue = function (valueObj) {
    return OptionValues.findOne({
        value: valueObj.value
    }).exec()
            .then(function (data) {
                if (data) {
                    var err = new Error(Msg.CATEGORY_EXISTS);
                    err.status = 409;
                    return Promise.reject(err);
                }
                console.log(valueObj);
                return OptionValues.create(valueObj)
                        .then(function (data) {
                            return Promise.resolve(data);
                            ;
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
};

exports.valueUpdate = function (blogCategory, blogCategoryId) {
    return OptionValues.findByIdAndUpdate(blogCategoryId, blogCategory, {
        new : true,
        runValidators: true
    });
};

exports.valueView = function (blogCategoryId) {
    return OptionValues.findById(blogCategoryId);
};

exports.valueDelete = function (blogCategoryId) {
    return OptionValues.findByIdAndUpdate(blogCategoryId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};

exports.getValuesAll = function (typeId) {
    console.log(typeId, "typeeeee")
    const query = {
        deleted: {$exists: false},
        type: typeId
    }
    return OptionValues.find(query).then(function (data) {
        return Promise.resolve(data);
    });
};