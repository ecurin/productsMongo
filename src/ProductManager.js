const fs = require('fs')
const filename = '../assets/Products.json'


class ProductManager {

    #products = []

    #maxId = 0

    constructor(){
        this.#products = []
    }

    /**
     * Utilizado para obtener el mayor ID del arreglo 
     * con este valor luego se aumenta para registrar un nuevo producto
     */
    getMaxId(arr) {
        let max=0

        for (let i=0 ; i < arr.length ; i++) {
            
            parseInt(arr[i].id) > max ? max = arr[i].id: max
        }

        return max+1
    }

    async initialize() {
        this.#products = await this.readProductsFromFile()

        this.#maxId = this.getMaxId(this.#products) 

    }

    /**
     * Leemos el archivo y su texto lo convertimos a JSON
     * @returns array con registros
     */

    async readProductsFromFile() {
        try {
            const ProductsFileContent = await fs.promises.readFile(filename, 'utf-8')

            const jsonFC = JSON.parse(ProductsFileContent)

            return jsonFC
        }
        catch (err) {
            return []   
        }
    }

    /**
     * 
     * @returns Obtiene todos productos
     */
    async getProducts(){
        return await this.readProductsFromFile()
    }


    /**
     * Busca la posición del producto dentro del array
     * 
     * @param {code} codigo del producto
     * @returns indice del producto
     */
    findProductIndex(code){

        const productIndex = this.#products.findIndex(p => p.code === code)

        return productIndex

    }


    async isNumeric(value) {
        return /^\d+$/.test(value);
    }
    /**
     * 
     * Agreamos un nuevo producto previamente se validar que este no exista
     * 
     * @param {String} title 
     * @param {String} description 
     * @param {Number} price 
     * @param {String} thumbnail 
     * @param {String} code 
     * @param {Number} stock 
     * @param {Boolean} status 
     * @returns 
     */
    async addProduct(title, description, price, thumbnail, code, stock, status=true ) {

        if(!title || !description || !price || !thumbnail || !code || !stock)
            return 'Debe enviar todos los valores (title, description, price, thumbnail, code, stock, status)'


            if (isNaN(price))      return 'Price no válidos'

            if (isNaN(stock))      return 'Stock no válidos'

        const productIndex = this.findProductIndex(code) 

        if(productIndex > -1){
            console.error('Producto ya existe')
            return 'Producto ya existe'
        }


        const id = this.#maxId++

        const product = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status
        }

        this.#products.push(product) 

        return await this.#updateFile()  

        

    }


    /**
         * Metodo utilizado para buscar un producto
         * @param {identificador del producto} idProd 
         * @returns 
         */
    async getProductById(idProd){

        const prdBuscado = this.#products.find(prd => prd.id ===idProd)
        if(!prdBuscado){
            console.error("producto no encontrado")
            return 
        }
        return prdBuscado
            
    }


    /**
     * Actualiza el contenido del archivo con los productos actualizados
     */
    async #updateFile() {
        await fs.promises.writeFile(filename, JSON.stringify(this.#products, null, '\t'))

        return true
    }


    /**
     * Actualiza el array con la nueva información
     */
    async updateProduct(updatedProduct) {


        console.log("Nuevos datos => " , updatedProduct)
        const productIndex = this.findProductIndex(updatedProduct.code) 

        if (productIndex < 0) {
            console.error('Producto no encontrado')
            return
        }

        // grabamos los cambios en el arreglo
        const product = { ...this.#products[productIndex], ...updatedProduct }
        this.#products[ productIndex ] = product

        await this.#updateFile()
    }

    /**
     * Elimina producto utilizando el code del producto
     */
    async deleteProduct(code){

        const productIndex = this.findProductIndex(code) 

        if(productIndex < 0){
            console.error('Producto no encontrado')
            return
        }

        
        //quitamos el producto utilizando su ubicación
        this.#products.splice(productIndex, 1)

        await this.#updateFile()
    }



}

module.exports = ProductManager 

