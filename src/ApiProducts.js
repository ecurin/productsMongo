const express = require("express");
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')




app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')


app.unsubscribe('/', require('./routes/views.router'))


const manager = require("./ProductManager");

const cManager = require("./CartManager");


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // para que nuestro server sepa entender JSON

productsManager = new manager()

cartsManager = new cManager()

app.get("/", async (req, res) => {
     res.end("Bienvenido...");
});

/**
 * EndPoint Products
 */
app.get("/products/", async (req, res) => {


    const limit = req.query.limit
    let nLimit = 0

    if( !isNaN(limit)){
        nLimit = parseInt(limit)
    }

    console.log("limit => ",nLimit);


    let products = await productsManager.getProducts();

    if(limit >0)
        products = products.slice(0, limit);

    //res.json(products);
    res.send({status:'ok', 'result':products})
});



app.get("/products/:id", async (req, res) => {

  console.log(req.params.id)

  const product = await productsManager.getProductById(parseInt(req.params['id'])); //req.params.id)

  if (product) {
    res.json({status:'ok', 'result':product})
  } else {
    res.send({status:'error', 'result': 'Producto no Encontrado'} ) 
  }
});


/**
 * Almacena un nuevo producto
 */
app.post("/api/products/",async (req, res) => {

  const status = await productsManager.addProduct(req.query.title, req.query.description, req.query.price, req.query.thumbnail, req.query.code, req.query.stock,req.query.status);

  console.log(status)
  if (status===true)
     res.send({status:'ok',message:'producto almacenado'})
  else
    res.send({status:'error', message: status})
  
})



/**
 * Endpoint Cart
 */
app.get("/carts/", async (req, res) => {

    res.end("se requiere id");
  
})

app.get("/carts/:idc", async (req, res) => {

  
  const product = await productsManager.getProductById(parseInt(req.params.id)); //req.params.id)

  if (product) {
    res.json(product);
  } else {
    res.end("error, Producto no Encontrado");
  }
})


app.post("/api/cart/",async (req, res) => {

  console.log(req.query.idc, req.query.idp, req.query.quantity)

  const status = await cartsManager.addProduct2Cart(req.query.idc, req.query.idp, req.query.quantity)

  console.log(status)
  if (status===true)
     res.send({status:'ok',message:'producto agregado al carro'})
  else
    res.send({status:'error', message: status})
  
})




/** 
 * ======================
 */

cartsManager.initialize()

productsManager.initialize()
    .then(() => {
    app.listen(8080, function (err) {
      console.log("Server listening on Port", 8080)
    })
    }).catch(err => {
      console.log("Error in server...")
      console.err(err);
    });

