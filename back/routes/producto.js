const express = require('express')
const productoController = require('../controllers/productoController')

const api = express.Router()
const auth = require('../middleware/authenticate')
const multiparty = require('connect-multiparty')
const path = multiparty({uploadDir: './uploads/productos'})

api.post('/registro_producto_admin', [auth.auth, path], productoController.registro_producto)

api.get('/listar_producto_admin/:filtro?', auth.auth, productoController.listar_producto_admin)
api.get('/obtener_imagen/:img', productoController.obtener_imagen)
api.get('/obtener_producto_admin/:id', auth.auth, productoController.obtener_producto_admin)

api.put('/actualizar_producto_admin/:id', [auth.auth, path], productoController.actualizar_producto)

api.delete('/borrar_producto_admin/:id', auth.auth, productoController.elimiar_producto)


api.get('/listar_inventario_producto/:id',auth.auth, productoController.listar_inventario)
api.delete('/eliminar_intario_producto/:id', auth.auth, productoController.eliminar_inventario)
api.post('/agregar_inventario_producto', auth.auth, productoController.registro_inventario_producto)
module.exports=api