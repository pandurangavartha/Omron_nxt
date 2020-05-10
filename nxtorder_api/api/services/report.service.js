const Promise = require('bluebird');

const Order = require('../models/order.model');
const Msg = require('../../config/strings');
const moment = require('moment')
const _ = require('lodash');

exports.sales = function (store_id, fromDate, toDate) {
    var pipeline = [
        {
            '$match': {
                '$and': [
                    { 'store._id': store_id },
                    {
                        'createdAt': {
                            '$lte': moment.utc(toDate, "MM/DD/YYYY").endOf('day').toDate(),
                            '$gte': moment.utc(fromDate, "MM/DD/YYYY").startOf('day').toDate()
                        }
                    },
                    {
                        'status': 'Closed'
                    }
                ]
            }
        },
        {
            '$group': {
                '_id': '$orderType',
                'totalPrice': { '$sum': "$totalAmount" },
                'count': { '$sum': 1 }
            }
        }
    ]

    return Order.aggregate(pipeline).exec()
        .then(function (result) {
            return Promise.resolve(result);
        }).catch(function (err) {
            if (err.name === 'ValidationError') {
                var err1 = new Error(err.message);
                err1.status = 400;
                return Promise.reject(err1);
            }
            console.log(err);
            var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
            err2.status = 500;
            return Promise.reject(err2);
        });
};

exports.taxCollected = function (store_id, fromDate, toDate) {
    var pipeline = [
        {
            '$match': {
                '$and': [
                    { 'store._id': store_id },
                    {
                        'createdAt': {
                            '$lte': moment.utc(toDate, "MM/DD/YYYY").endOf('day').toDate(),
                            '$gte': moment.utc(fromDate, "MM/DD/YYYY").startOf('day').toDate()
                        }
                    },
                    {
                        'status': 'Closed'
                    }
                ]
            }
        },
        {
            '$group': {
                '_id': { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" } },
                'totalPrice': { '$sum': "$taxAmount" },
                'count': { '$sum': 1 }
            }
        }
    ]

    return Order.aggregate(pipeline).exec()
        .then(function (result) {
            return Promise.resolve(result);
        }).catch(function (err) {
            if (err.name === 'ValidationError') {
                var err1 = new Error(err.message);
                err1.status = 400;
                return Promise.reject(err1);
            }
            console.log(err);
            var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
            err2.status = 500;
            return Promise.reject(err2);
        });
};

exports.soldProducts = function (store_id, fromDate, toDate) {
    var pipeline = [
        {
            '$match': {
                '$and': [
                    { 'store._id': store_id },
                    {
                        'createdAt': {
                            '$lte': moment.utc(toDate, "MM/DD/YYYY").endOf('day').toDate(),
                            '$gte': moment.utc(fromDate, "MM/DD/YYYY").startOf('day').toDate()
                        }
                    },
                    {
                        'status': 'Closed'
                    }
                ]
            }
        },
        {
            '$group': {
                '_id': { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" } },
                'totalPrice': { '$sum': "$taxAmount" },
                'count': { '$sum': 1 }
            }
        }
    ]

    return Order.aggregate(pipeline).exec()
        .then(function (result) {
            return Promise.resolve(result);
        }).catch(function (err) {
            if (err.name === 'ValidationError') {
                var err1 = new Error(err.message);
                err1.status = 400;
                return Promise.reject(err1);
            }
            console.log(err);
            var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
            err2.status = 500;
            return Promise.reject(err2);
        });
};

