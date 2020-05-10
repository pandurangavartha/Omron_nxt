const Promise = require('bluebird');

const Privacy = require('../models/privacy.model');
//const BlogCategory = require('../models/blog-category.model');
const Msg = require('../../config/strings');

exports.create = function (privacy) {
    
    return Privacy.findOne({
        title: privacy.title
    }).exec()
            .then(function (data) {
                if (data) {
                    var err = new Error(Msg.CATEGORY_EXISTS);
                    err.status = 409;
                    return Promise.reject(err);
                }
//                return BlogCategory.findOne({
//                    _id: blogs.category
//                }).exec()
//                        .then(function (category) {
//                            blogs.category = category
                            return Privacy.create(privacy)
                                    .then(function (data) {
                                        return Promise.resolve(data);
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
//                        })F


            })
};
//
exports.update = function (privacyData, privacyId) {
    return Privacy.findByIdAndUpdate(privacyId, privacyData, {
        new : true,
        runValidators: true
    });
};
//
exports.view = function (privacyId) {
    return Privacy.findById(privacyId);
};
//
exports.delete = function (privacyId) {
    return Privacy.findByIdAndUpdate(privacyId, { deleted: true }, {
        new: true,
        runValidators: true
    });
};
//
exports.getAll = function (req) {
    var query ={
        deleted: {$exists: false}
    }
    if(req.type) {
        query.type = req.type;
    }
    return Privacy.find(query).then(function (data) {
        return Promise.resolve(data);
    });
};
