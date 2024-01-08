const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductoSchema = Schema({
    titulo: {type: String, require: true},
    slug: {type: String, require: true},
    galeria:[ {type: Object, require: false}],
    portada: {type: String, require: true},
    precio: {type: Number, require: true},
    descripcion: {type: String, require: true},
    contenido: {type: String, require: true},
    stock: {type: Number, require: true},
    nventas: {type: Number, default: 0,require: true},
    npuntos: {type: Number, default: 0,require: true},
    categoria: {type: String, require: true},
    estado: {type: String, default: 'edicion', require: true},
    createAt: {type: Date, default: Date.now, require: true},
})

module.exports = mongoose.model('producto', ProductoSchema)