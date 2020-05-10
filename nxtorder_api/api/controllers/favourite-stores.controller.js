const FavouriteStoresService = require('../services/favourite-stores.service');

exports.register = function (req, res, next) {
    console.log(req.body, "req.bodyreq.body")
    var favouriteStoesObj = req.body
     favouriteStoesObj.user = req.user
//    console.log(favouriteStoesObj, "cartObjcartObj00000000000")
    FavouriteStoresService.create(favouriteStoesObj).then(function (favourites) {
        return res.send({ result: favourites });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.delete = function (req, res, next) {
    FavouriteStoresService.delete(req.params.favourite-store_id).then(function (favouriteStores) {
        return res.send({ result: favouriteStores });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

exports.unfavStores = function (req, res, next) {
    FavouriteStoresService.unfavStores(req.params.store_id).then(function (favouriteStores) {
        console.log(favouriteStores, 'favouriteStores')
        return res.send({ result: favouriteStores });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
//
//exports.all = function (req, res, next) {
//    CartService.getAll(req.params.store_id).then(function (data) {
//        return res.send({ result: data })
//    }).catch(function (err) {
//        return res.status(400).send({ result: { error: err.message } })
//    });
//}
//
exports.favouriteStoresAllItems = function (req, res, next) {
    console.log(req.params.user_id, "userrrrrr")
    FavouriteStoresService.getItemsAll(req.params.user_id, req.query).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
}