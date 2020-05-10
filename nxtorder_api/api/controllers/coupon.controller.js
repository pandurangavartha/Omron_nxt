const CouponService = require('../services/coupon.service');
const Msg = require('../../config/strings');

exports.register = function (req, res, next) {

    var couponObj = req.body
//    couponObj.addedBy = req.user;
//    couponObj.addedBy = req.body.user;
    couponObj.couponStatus="Process";
    couponObj.status="Active";
    couponObj.user=req.body.user;
    console.log(couponObj, "objjjjj")
//        required: 'Offer type is missing.'

//    if (req.file) {
//        couponObj.logo = req.file.path
//    }
    console.log("in fileeee", req.file.path)

    CouponService.create(couponObj,req).then(function (coupon) {
        return res.send({ result: coupon });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.update = function (req, res, next) {
    var coupon = req.body

    if (req.file) {
        coupon.logo = req.file.path
    }

//    delete offer.store;

    CouponService.update(coupon, req.params.coupon_id)
        .then(function (coupon) {
            return res.send({ result: coupon });
        })
        .catch(function (err) {
            return res.status(400).send({ result: { error: err.message } })
        })
};

exports.view = function (req, res, next) {
    CouponService.view(req.params.offer_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.delete = function (req, res, next) {
    CouponService.delete(req.params.offer_id).then(function (offer) {
        return res.send({ result: offer });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.all = function (req, res, next) {
//    if(req.params.user_id){
//        
//    }
    CouponService.getAll(req.query).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
exports.myCoupons = function (req, res, next) {
    CouponService.getAll(req.query).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
exports.products = function(req, res, next) {
    CouponService.getAllProducts(req.params.store_id).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};