
const Cliente = require('../models/cliente')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../helpers/jwt')

const registro_cliente = async (req, res) => {
    const data = req.body
    let array_err = []
    array_err = await Cliente.find({ email: data.email })

    if (array_err.length == 0) {
        if (data.password) {
            bcrypt.hash(data.password, null, null, async (err, hash) => {
                if (hash) {
                    data.password = hash
                    const reg = await Cliente.create(data)
                    res.status(200).send({ message: reg })
                } else {
                    res.status(400).send({ message: 'ErrorServer', data: undefined })
                }
            })
        } else {
            res.status(400).send({ message: 'no hay una contrasena', data: undefined })
        }
    } else {
        res.status(400).send({ message: 'el correo ya existe', data: undefined })
    }
}

const login_cliente = async (req, res) => {
    const data = req.body
    let clientes_corr = []

    clientes_corr = await Cliente.find({ email: data.email })

    if (clientes_corr.length == 0) {
        res.status(400).send({ message: 'no exites el usuario ', data: undefined })
    } else {
        let user = clientes_corr[0]
        bcrypt.compare(data.password, user.password, async (error, check) => {
            if (check) {
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                })
            } else {
                res.status(400).send({ message: 'datos erroneos', data: undefined })
            }
        })
    }
}

const listar_clientes_filtro_admin = async (req, res) => {
    if (req.user) {
        if (req.user.role == 'admin') {
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];
            if (tipo == null || tipo == 'null') {
                let reg = await Cliente.find({})
                res.status(200).send({ data: reg })
            } else {
                if (tipo == 'nombre') {
                    let reg = await Cliente.find({ nombre: new RegExp(filtro, 'i') })
                    res.status(200).send({ data: reg })
                } else if (tipo == 'correo') {
                    let reg = await Cliente.find({ email: new RegExp(filtro, 'i') })
                    res.status(200).send({ data: reg })
                }
            }
        } else {
            res.status(400).send({ message: 'no tienes permisos', data: undefined })
        }
    } else {
        res.status(400).send({ message: 'no tienes permisos', data: undefined })
    }
}

const registro_cliente_admin = async (req, res) => {
    if(req.user){
        if( req.user.role == 'admin' ) {
            const data = req.body
            bcrypt.hash('1234567', null, null, async (err, hash) => {
                if(hash){
                    data.password = hash
                    const reg = await Cliente.create(data)
                    res.status(200).send({ message: reg })
                }else{
                    res.status(400).send({ message: 'error en la contrasena ', data: undefined })
                }
            })
        }
    }
}

const obtener_clientes_admin = async (req, res) => {
    if(req.user){
        if( req.user.role == 'admin' ) {
            const id = req.params['id']
            
            try {
                const reg = await Cliente.findById({_id:id})
                res.status(200).send({data: reg})
            } catch (error) {
                res.status(200).send({data:undefined})
            }
            
        }else{
            res.status(500).send({message: 'no tienes permisos', data: undefined})
        }
    }else{
        res.status(500).send({message: 'no tienes permisos', data: undefined})
    }
}

const actualizar_cliente_admin = async (req, res) => {
    if(req.user){
        if(req.user.role == 'admin'){
            const id = req.params['id']
            const data = req.body

            const reg = await Cliente.findByIdAndUpdate({_id:id}, {
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero
            })
            res.status(200).send({data: reg})
        }else{
            res.status(500).send({message: 'NoAccess'})
        }
    }else{
        res.status(500).send({message: 'NoAccess'})
    }
}

const eliminar_cliente_admin = async (req, res) => {
    if(req.user){
        if(req.user.role == 'admin'){
            const id = req.params['id']
            const reg = await Cliente.findByIdAndRemove({_id:id})
            res.status(200).send({data: reg})
        }
        else{
            res.status(500).send({message: 'NoAccess'})
        }
    }
    else{
        res.status(500).send({message: 'NoAccess'})
    }
}

module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin, 
    obtener_clientes_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin
}