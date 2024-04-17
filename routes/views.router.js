const { Router } = require('express')
const Product = require('../models/product.model')

const router = Router()

router.get('/products', async (req, res) => {
    const page = req.query.page || 1

    const limit = (req.query.limit || 4 ) > 10 ? 10 : (req.query.limit || 4 ) 

    const txtSort = (req.query.sort || '') 
    
    const nSort = txtSort==='desc' ? -1 : 1

    res.render('products', {
        title: 'Productos',
        limit: limit,
        sort: txtSort,
        data: await Product.paginate({}, { limit: limit, page, lean: true, sort : {price : nSort} })
    })
})




router.get("/products/:id", async (req, res) => {

    console.log(req.params.id)
  
    const product = await Product.find({ code : req.params.id })
    res.status(200).json({
        result: 'success',
        data: product
    })

   
  });
  

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post('/products',jsonParser, async (req, res) => {

    console.log(req.body)

    let invalidFields = 0
    invalidFields += ['title', 'description', 'price', 'stock','code'].filter(field => !req.body[field]).length
    invalidFields += ['price', 'stock'].filter(field => isNaN(+req.body[field]) || +req.body[field] < 0).length

    if (invalidFields > 0) {
        res.status(400).json({
            result: 'error',
            message: 'Alguno de los campos es inválido!'
        })
        return
    }

    try {
        const newProduct = await Product.create(req.body)
        res.status(200).json({
            result: 'success',
            stats: newProduct
        })
    }
    catch (err) {
        res.status(500).json({
            result: 'error',
            info: err.message
        })
    }
})

// TODO: implementa este endpoint tú mismo/a
// router.put('/', async (req, res) => {

// })

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const stats = await Estudiante.deleteOne({ _id: id })
        res.status(200).json({
            result: 'success',
            stats
        })
    }
    catch (err) {
        res.status(500).json({
            result: 'error',
            info: err.message
        })
    }
})
module.exports = router