const fs = require('fs')
const filename = '../assets/Cart.json'


class CartManager {

    #carts = []

    #maxId = 0

    constructor(){
        this.#carts = []
    }

    /**
     * Utilizado para obtener el mayor ID del arreglo 
     * con este valor luego se aumenta para registrar un nuevo carro
     */
    getMaxId(arr) {
        let max=0

        for (let i=0 ; i < arr.length ; i++) {
            
            parseInt(arr[i].id) > max ? max = arr[i].id: max
        }

        return max+1
    }

    async initialize() {
        this.#carts = await this.readCartsFromFile()

        this.#maxId = this.getMaxId(this.#carts) 

    }

    /**
     * Leemos el archivo y su texto lo convertimos a JSON
     * @returns array con registros
     */

    async readCartsFromFile() {
        try {
            const CartsFileContent = await fs.promises.readFile(filename, 'utf-8')

            const jsonFC = JSON.parse(CartsFileContent)
            console.log(jsonFC)
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
    async getCarts(){
        return await this.readCartsFromFile()
    }


    /**
     * Busca la posición del producto dentro del array
     * 
     * @param {id} codigo del producto
     * @returns indice del producto
     */
    findCartIndex(idcart){

        const cartIndex = this.#carts.findIndex(c => c.id === idcart)

        return cartIndex

    }



    /**
     * 
     * Agreamos un nuevo producto previamente se validar que este no exista
     * 
     * @param {String} title 
     * @param {String} description 
     * @param {Number} price 
     * @returns 
     */
    async addProduct2Cart(idc,idp, quantity) {

        if(!idc || !idp || !quantity )
            return 'Debe enviar todos los valores (idc, idp, cant)'


        if (isNaN(quantity))      return 'Cantidad no válida'

        const cartIndex = this.findCartIndex(idc) 
        

        //carro ya existe por lo que buscamos sus productos
        if(cartIndex > -1){

            const cart = this.#carts[cartIndex]

            const products = cart["products"]

            const pIndex  = products.findIndex(c => c.id === idp)

            //producto ya existe en el carro
            if(pIndex>-1){
                
                const updatedProduct = {'id': products[pIndex].id, 'quantity':    parseInt(products[pIndex].quantity) + parseInt(quantity)}

                const prod = { ...products[pIndex], ...updatedProduct }

                products[pIndex] = updatedProduct

                cart["products"] = products

                console.log('carro actualizado' , cart )

                this.#carts[ cartIndex ] = cart
            }else{
                const product = {'id':idp, 'quantity': parseInt(quantity)}
                products.push(product)

            }


        }else{
            const id = this.#maxId++

            const products = [{'id':idp, 'quantity': parseInt(quantity)}]

            const cart = {
                'id':idc,
                'products':products
            }
    
            this.#carts.push(cart) 
    
        }

        return await this.#updateFile()  


        

        

    }


    /**
         * Metodo utilizado para buscar un producto
         * @param {identificador del producto} idProd 
         * @returns 
         */
    async getCartById(idc){

        const cartBuscado = this.#carts.find(cart => cart.id ===idc)
        if(!cartBuscado){
            console.error("Carro no encontrado")
            return 
        }
        return cartBuscado
            
    }


    /**
     * Actualiza el contenido del archivo con los productos actualizados
     */
    async #updateFile() {
        await fs.promises.writeFile(filename, JSON.stringify(this.#carts, null, '\t'))

        return true
    }


    /**
     * Actualiza el array con la nueva información
     */
    async updateProduct(updatedProduct) {


        console.log("Nuevos datos => " , updatedProduct)
        const cartIndex = this.findProductIndex(updatedProduct.code) 

        if (productIndex < 0) {
            console.error('Producto no encontrado')
            return
        }

        // grabamos los cambios en el arreglo
        const cart = { ...this.#carts[cartIndex], ...updatedProduct }
        this.#carts[ cartIndex ] = cart

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
        this.#carts.splice(productIndex, 1)

        await this.#updateFile()
    }



}

module.exports = CartManager 

