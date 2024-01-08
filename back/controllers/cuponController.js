var Cupones = require('../models/cupones')

const restro_cupones_admin = async function(req, res){
    if(req.user){
        if( req.user.role == 'admin' ) {
            let data = req.body;
            let reg = await Cupones.create(data)
            res.status(200).json({data:reg})
            
        } else {
            res.status(500).json({message: 'NoAccess'})
        }
    } else {
        res.status(500).json({message: 'NoAccess'})
    }
}

const listar_cupones = async function(req, res){
    if(req.user){
        if(req.user.role == 'admin'){
            let filtro = req.params['filtro'];
            let reg = await Cupones.find({codigo: new RegExp(filtro, 'i')})
            res.status(200).json({message: 'datos listados ',data:reg})
        }else{
            res.status(500).json({message: 'NoAccess'})
        }
    }else{
        res.status(500).json({message: 'NoAccess'})
    }
}

module.exports = {
    restro_cupones_admin, 
    listar_cupones
}