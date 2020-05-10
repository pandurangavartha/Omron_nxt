const IndustryService = require('../services/industry.service');
const Msg = require('../../config/strings');
const _ = require('lodash');

const searchService = require('../services/medicine-search')

exports.search = ( req, res, next ) => {
    let searchString = req.params.searchString;
    searchService.search(searchString).then( results => {
        let sendResponse = { 
            status: 'success',
            searchText: searchString,
            data: results
        }
        return res.status(200).send( sendResponse );
    }).catch( err => {
        return res.status(400).send({ status: 'failed', data: { error: err.message } });
    })
}

