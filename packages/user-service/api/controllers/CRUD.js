class CRUD {
    constructor(model) {
        this.model = model;
    }

    create(req) {
        const objectToCreate = new this.model(req.body);
        return objectToCreate.save()
            .then(objectCreated => objectCreated)
            .catch(e => e);
    }

    read(req) {
        if (req.params.id) {
            return this.model.findOne({
                _id: req.params.id,
            }).then((object) => {
                if (!object) {
                    throw Error('Object not found');
                }
                return object;
            });
        }
        if (req.query) {
            return this.model.find(req.query)
                .then(objects => objects)
                .catch(e => e);
        }
    }

    update(req) {
        return this.model.findOneAndUpdate({
            _id: req.params.id,
        }, {
            $set: req.body,
        }, {
            body: req.body,
            new: true
        }, ).then((objectUpdated) => {
            if (!objectUpdated) {
                throw Error('Object not found');
            }
            return objectUpdated;
        });
    }

    delete(req) {
        return this.model.findOneAndDelete({
            _id: req.params.id,
        }).then((object) => {
            if (!object) {
                throw Error('Object not found');
            }
            return object;
        });
    }
}

class CRUDUser extends CRUD {
    read(req) {
        return req.user
    }

    addToCart(req) {
        return this.model.findOneAndUpdate({
                _id: req.user._id,
            }, {
                $push: {
                    cart: req.body.productID
                }
            }, {
                body: req.body.productID , new: true
            })
            .then(object => (!object ?
                'Not found' :
                object))
            .catch(e => e);
    }

    addToFav(req) {
        return this.model.findOneAndUpdate({
            _id: req.user._id,
            }, {
                $push: {
                    favorites: req.body
                }
            }, {
                body: req.body.smartcard, new: true
            })
            .then(object => (!object ?
                'Not found' :
                object))
            .catch(e => e);
    }

    addToHistory(req) {
        return this.model.findOneAndUpdate({
            _id: req.user._id,
            }, {
                $push: {
                    history: req.body
                }
            }, {
                body: req.body.smartcard, new: true
            })
            .then(object => (!object ?
                'Not found' :
                object))
            .catch(e => e);
    }
}



module.exports = {
    CRUD,
    CRUDUser
};