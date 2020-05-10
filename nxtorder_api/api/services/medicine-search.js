const Promise = require('bluebird');
const blogs = require('../models/blogs.model');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.search = async searchstring => {
    try {
       return await blogs.aggregate( [
                //{ $project: { tags: { $tolower: searchstring } } },
                { $match: { tags: { $in : [ searchstring ] } } },
                {
                    $lookup : {
                        from: 'blogslikes',
                        localField: "_id",
                        foreignField: "blogs._id",
                        as: "likes"
                    }
                }
            ])
    }
    catch (err) {         
        let error = new Error(err.message);
        error.status = 400;
        return error;        
    }
}