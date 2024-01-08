var express = require('express')
var cuponController = require('../controllers/cuponController')

var api = express.Router()
var auth = require('../middleware/authenticate')

api.post('/registro_cupon', auth.auth, cuponController.restro_cupones_admin)

api.get('/listar_cupones/:filtro?', auth.auth, cuponController.listar_cupones)


module.exports = api
