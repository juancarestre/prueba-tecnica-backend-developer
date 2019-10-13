const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const {
    Schema
} = mongoose;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 70,
    },
    price: {
        type: String,
        required: true,
    }
}, {
    timestamps: {
        createdAt: 'created_at'
    }
}, );


const Product = mongoose.model('Product', productSchema);

module.exports = {
    productSchema,
    Product
};