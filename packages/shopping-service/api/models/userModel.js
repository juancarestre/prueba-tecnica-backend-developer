const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const {
    Schema
} = mongoose;
const {
    productSchema
} = require('./productModel')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 70,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: [true, '${VALUE} is already taken'],
        validate: {
            validator: validator.isEmail,
            message: '${VALUE} is not a valid email',
        },
    },
    favorites: [{
        type: productSchema,
        required: false,
    }],
    cart: [{
        type: Schema.Types.ObjectId,
        required: false,
    }],
    history: [{
        type: productSchema,
        required: false,
    }],
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
    }, ],
}, {
    timestamps: {
        createdAt: 'created_at'
    }
}, );

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isNew) {
        bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(user.password, salt))
            .then((hash) => {
                user.password = hash;
                next();
            })
            .catch((e) => {
                next();
            });
    } else {
        next();
    }
});

userSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': decoded.access,
    });
};

userSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = `auth`;
    const token = jwt
        .sign({ _id: user._id.toHexString(), access }, process.env.SECRET, {
            expiresIn: 2592000, // un mes
        })
        .toString();
    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => token);
};

userSchema.methods.logOut = function (tokenToDelete) {
    const user = this;
    user.tokens = user.tokens.filter(token => token.token !== tokenToDelete);
    return user.save().then(() => ({ res: 'logout OK', spoiler: 'Thanos dies' }));
};

userSchema.statics.authenticate = function (email, password) {
    const User = this;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt
                .compare(password, user.password)
                .then((result) => {
                    if (result) {
                        resolve(user);
                    } else {
                        reject();
                    }
                })
                .catch(e => e);
        });
    });
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, [
        '_id',
        'name',
        'email',
        'favorites',
        'cart',
        'history'
    ]);
};


const User = mongoose.model('User', userSchema);

module.exports = {
    User,
};