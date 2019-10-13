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
                    return { message : 'Object not found' }
                }
                return object;
            });
        }
        if (req.query) {
            return this.model.find(req.query)
                .then(objects => objects)
                .catch(e => {console.log(e); return e});
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

class CRUDProducts extends CRUD {

    deleteAll() {
        return this.model.deleteMany({}).then((object) => {
            if (!object) {
                throw Error('Object not found');
            }
            return object;
        });
    }

}


module.exports = {
    CRUDProducts
};