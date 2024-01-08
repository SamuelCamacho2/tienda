
const Admin = require('../models/admin')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../helpers/jwt')

const registro_admin = async (req, res)=> {
    const data = req.body
    let admin_arr = []

    admin_arr = await Admin.find({email:data.email})

    if( admin_arr == 0){
        if(data.password){
            bcrypt.hash(data.password,null,null, async (err, hash)=>{
                if(hash){
                    data.password = hash
                    const reg = await Admin.create(data)
                    res.status(200).send({
                        message: reg
                    })
                }else{
                    res.status(200).send({message: 'ErrorServer', data:undefined})
                }
            })
        }else{
            res.status(200).send({message: 'Escribe una contrasena', data:undefined})
        }
    }else{
        res.status(200).send({message: 'el correo ya existe', data:undefined})
    }
}

const login_admin = async (req, res) =>{
    const data = req.body
    let admin_corr = []

    admin_corr = await Admin.find({email: data.email})

    if(admin_corr.length == 0){
        res.status(200).send({message: 'no existe el usuario', data: undefined})
    }else{
        let user = admin_corr[0]
        bcrypt.compare(data.password, user.password, async (error, check)=> {
            if (check) {
                res.status(200).send({ 
                    data: user,
                    message: user,
                    Token: jwt.createToken(user) 
                })
            } else {
                res.status(200).send({ message: 'datos erroneos', data: undefined })
            }
        })
    }
}

module.exports = {
    registro_admin,
    login_admin
}