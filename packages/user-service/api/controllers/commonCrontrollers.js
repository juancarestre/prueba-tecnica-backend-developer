const read = (crud, req, res) => {
    crud.read(req)
        .then(object => res.status(200).send(object))
        .catch(e => searchObject(res, e) || res.status(401).send(e));
};

const create = (crud, req, res) => crud.create(req)
    .then((object) => {
        if (object.errors) {
            return res.status(400).send(object);
        } if (object.errmsg) {
            return res.status(400).send({
                error: object.errmsg,
            });
        }
        res.status(200).send(object);
    }).catch(e => res.status(401).send(e)) // revisar este codigo de error
    ;

const update = (crud, req, res) => {
    if (!res) {
        crud.update(req)
            .then(object => 200)
            .catch(e => 500); // revisar este codigo de error
    } else {
        crud.update(req)
            .then(object => res.status(200).send(object))
            .catch(e => searchObject(res, e) || res.status(401).send(e)); // revisar este codigo de error
    }
};

const deleteC = (crud, req, res) => {
    crud.delete(req)
        .then(object => res.status(200).send(object))
        .catch(e => searchObject(res, e) || res.status(401).send(e));
};

const searchObject = (res, e) => {
    console.log('SearchObject Error', JSON.stringify(e))
    if (e.message === 'Object not found') {
        return res.status(204).send(e);
    } if (JSON.stringify(e.message).includes('Cast to ObjectId failed for value')) {
        return res.status(400).send(e);
    }
};

module.exports = {
    read,
    create,
    update,
    deleteC,
};