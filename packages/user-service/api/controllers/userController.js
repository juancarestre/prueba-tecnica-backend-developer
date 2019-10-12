const {
    CRUDUser
} = require('./CRUD');
const logger = require('../log');
const {
    User
} = require('../models/userModel')

const userCrud = new CRUDUser(User)

const createUser = (req, res) => {
    let token;
    userCrud.create(req).then(async (user) => {
        if (user.errors) {
            return res.status(400).send(user.errors);
        }
        if (user.errmsg) {
            return res.status(400).send({
                error: user.errmsg,
            });
        }
        try {
            token = await user.generateAuthToken();
        } catch (error) {

        }
        res.status(200).header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send();
    });
}

const loginUser = (req, res) => {
    let loggedUser;
    logger.info(`loginUser ${req.body.email}`);
    User.authenticate(req.body.email, req.body.password)
        .then((user) => {
            loggedUser = user;
            return user.generateAuthToken();
        }).then((token) => {
            loggedUser = JSON.parse(JSON.stringify(loggedUser));
            loggedUser.token = token;
            res.status(200).header('x-auth', token).send(loggedUser);
        }).catch((e) => {
            logger.warn(`FAILED loginUser ${req.body.email}`);
            res.status(401).send();
        });
};

const getUser = (req, res) => {
    const user = userCrud.read(req);
    res.status(200).send(user);
};

const myCart = (req, res) => {
    const user = userCrud.read(req);
    res.status(200).send({
        cartList: user.cart
    });
};

const myFavorite = (req, res) => {
    const user = userCrud.read(req);
    res.status(200).send({
        favorites: user.favorites
    });
};

const myHistory = (req, res) => {
    const user = userCrud.read(req);
    res.status(200).send({
        history: user.history
    });
};

const addToCart = (req, res) => {
    userCrud.addToCart(req).then(result => {
        logger.info(`addToCart ${req.body.productID}`);
        res.send(result)
    })
}

const addToHistory = (req, res) => {
    userCrud.addToHistory(req).then(result => {
        logger.info(`addToHistory ${JSON.stringify(req.body)}`);
        res.send(result)
    })
}

const addToFavorites = (req, res) => {
    userCrud.addToFav(req).then(result => {
        logger.info(`addToFavorites ${JSON.stringify(req.body)}`);
        res.send(result)
    })
}

module.exports = {
    createUser,
    loginUser,
    getUser,
    addToCart,
    addToHistory,
    addToFavorites,
    myCart,
    myFavorite,
    myHistory
}