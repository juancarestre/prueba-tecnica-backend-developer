const { ObjectID } = require('mongodb');
const { User } = require('../../models/userModel');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const cart1 = new ObjectID("5da249638b369c0056f6618a")
const cart2 = new ObjectID("5da249638b369c0056f6618b")
const cart3 = new ObjectID("5da249638b369c0056f6618c")


const users = [{
    _id: userOneId,
    email: 'juan.restrepo18@king.com',
    password: '123456',
    name: 'Juan',
    cart: [cart1, cart2, cart3],
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.SECRET).toString(),
    }],
}, {
    _id: userTwoId,
    email: 'restrepo.juan@asd.com',
    password: '123456',
    name: 'restrepo',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.SECRET).toString(),
    }],
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    users,
    populateUsers,
};