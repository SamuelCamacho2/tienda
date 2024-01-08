const mongoose =require('mongoose')
var Schema = mongoose.Schema

const AdminSchema = Schema({
    nombre: {type: String, require: true},
    apellidos: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    telefono: {type: String, require: true},
    rol: {type: String, require: true},
    dni: {type: String, require: true},
})

module.exports = mongoose.model('admin', AdminSchema)