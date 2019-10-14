const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const {
    Schema
} = mongoose;

// {
//     "user": {
//         "_id": "5da25bfd7c128e027f8ee412",
//         "name": "juan",
//         "email": "juan.restrepo@udea.edu.co"
//     },
//     "product": {
//         "_id": "5da394f1a160ea003d167960",
//         "name": "pc",
//         "price": "0.003",
//         "addressToBuy": "mxgD3HgYEYQ1JeF9yFoydtEiyVHs7HNPp9",
//         "created_at": "2019-10-13T21:25:04.913Z",
//         "updatedAt": "2019-10-13T21:25:04.913Z",
//         "__v": 0
//     },
//     "transactionId": "8855de8d85f1190291af8d54645ee53efe573459f5dda91c06108fcf438aa3d3"
// }

const transactionSchema = new mongoose.Schema({
    user__id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true
    },
    product__id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    product_name: {
        type: String,
        required: true,
    },
    product_price: {
        type: String,
        required: true,
    },
    product_addressToBuy: {
        type: String,
        required: true,
    },
    "transactionId": {
        type: String,
        required: true,
        unique: true
    },
    "confirmed": {
        type: Boolean,
        required: true,
        default: false
    },
    "message": {
        type: String,
        required: false
    }

}, {
    timestamps: {
        createdAt: 'created_at'
    }
}, );


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
    Transaction
};