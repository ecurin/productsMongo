const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const schema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    status: Boolean
})



schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Product', schema, 'products')