 const OptionTypeService = require('../services/option-type.service');

exports.typeAdd = function (req, res, next) {
    var typeObj = req.body

    OptionTypeService.createType(typeObj).then(function (blogCategory) {
        return res.send({ result: blogCategory });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
//
exports.update = function (req, res, next) {
    var blogCategory = req.body
    BlogCategoryService.update(blogCategory, req.params.blog_id)
        .then(function (productCategory) {
            return res.send({ result: blogCategory });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};
//
exports.view = function (req, res, next) {
    BlogCategoryService.view(req.params.blog_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
//
exports.delete = function (req, res, next) {
    BlogCategoryService.delete(req.params.blog_id).then(function (blogCategory) {
        return res.send({ result: blogCategory });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
//
exports.all = function (req, res, next) {
    BlogCategoryService.getAll().then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
}

exports.valueAdd = function (req, res, next) {
    var valueObj = req.body

    OptionTypeService.createValue(valueObj).then(function (blogCategory) {
        return res.send({ result: blogCategory });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
exports.valuesAll = function (req, res, next) {
    var typeId = req.params.type_id;
    OptionTypeService.getValuesAll(typeId).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
}