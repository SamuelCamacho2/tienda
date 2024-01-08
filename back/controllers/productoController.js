var Prodcuto = require('../models/producto');
var Inventario = require('../models/proveedor')
var fs = require('fs');
var path = require('path');

const registro_producto = async function (req, res){
    if(req.user){
        if(req.user.role = 'admin'){
            let data = req.body

            var img_path = req.files.portada.path;
            var nemae = img_path.split('/');
            var portada = nemae[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            data.portada = portada;
            let reg = await Prodcuto.create(data)

            let inventario = await Inventario.create({
                admin: req.user.sub,
                cantidad: data.stock,
                proveedor: 'primer registro',
                producto: reg._id
            })

            res.status(200).send({message: 'Producto registrado', producto: reg, inventario: inventario})

        }else{
            res.status(500).send({message: 'No access'})
        }
    }else{
        res.status(500).send({message: 'No access'})
    }
}

const listar_producto_admin = async function (req, res){
    if(req.user){
        if(req.user.role = 'admin'){
            var filtro = req.params['filtro']
            let reg = await Prodcuto.find({titulo: new RegExp(filtro, 'i')})
            res.status(200).send({ data: reg})
        }else{
            res.status(500).send({message: 'No access'})
        }
    }else{
        res.status(500).send({message: 'No access'})
    }
}

const obtener_imagen = async function (req, res){
    var img = req.params['img'];
    fs.stat('./uploads/productos/'+img, function(err){
        if(!err){
            let path_img = './uploads/productos/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/imagen.png';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const obtener_producto_admin = async function(req, res){
    if(req.user){
        if( req.user.role == 'admin' ) {
            const id = req.params['id']
            
            try {
                const reg = await Prodcuto.findById({_id:id})
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

const actualizar_producto = async function (req, res){
    if(req.user){
        if(req.user.role = 'admin'){
            let id = req.params['id']
            let data = req.body

            if(req.files){
                var img_path = req.files.portada.path;
                var nemae = img_path.split('/');
                var portada = nemae[2];

                let reg = await Prodcuto.findByIdAndUpdate({_id: id},{
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    descripcion: data.descripcion,
                    categoria: data.categoria,
                    contenido: data.contenido,
                    portada: portada
                })
                fs.stat('./uploads/productos/'+reg.portada, function(err){
                    if(!err){
                        fs.unlink('./uploads/productos/'+reg.portada, (err)=>{
                            if(err) throw err;
                        })
                    }
                })
                res.status(200).send({message: 'Producto actualizado', producto: reg})
            }else{
                let reg = await Prodcuto.findByIdAndUpdate({_id: id},{
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    descripcion: data.descripcion,
                    categoria: data.categoria,
                    contenido: data.contenido,
                })
                res.status(200).send({message: 'Producto actualizado', producto: reg})
            }

        }else{
            res.status(500).send({message: 'No access'})
        }
    }else{
        res.status(500).send({message: 'No access'})
    }
}

const elimiar_producto = async function(req, res) {
    if (req.user) {
        if(req.user.role = 'admin'){
            var id = req.params['id'];
            let reg = await Prodcuto.findByIdAndRemove({_id: id});
            res.status(200).send({message: 'Producto eliminado', producto: reg})
        }else{
            res.status(500).send({message: 'No access'})
        }
    } else {
        res.status(500).send({message: 'No access'})
    }
}

const listar_inventario = async function(req, res){
    if(req.user){
        if (req.user.role == 'admin') {
            var id = req.params['id'];
            var reg =  await Inventario.find({producto: id}).populate('admin').sort({createdAt: -1})
            res.status(200).send({data: reg})
        } else {
            res.status(500).send({message: 'No access'})
        }
    }else{
        res.status(500).send({message: 'No access'})
    }
}

const eliminar_inventario = async function(req, res){
    if(req.user){
        if(req.user.role = 'admin'){
            var id = req.params['id'];
            let reg = await Inventario.findByIdAndRemove({_id: id});

            let prod = await Prodcuto.findById({_id: reg.producto})
            let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);

            let producto = await Prodcuto.findByIdAndUpdate({_id: reg.producto}, {stock: nuevo_stock})

            res.status(200).send({ data: producto})
        }else{
            res.status(500).send({message: 'No access'})
        }
    }else{
        res.status(500).send({message: 'No access'})
    }
}

const registro_inventario_producto = async function(req, res){
    if(req.user){
        if(req.user.role = 'admin'){
            let data = req.body

            let reg = await Inventario.create(data)

            let prod = await Prodcuto.findById({_id: reg.producto})
            let nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad);

            let producto = await Prodcuto.findByIdAndUpdate({_id: reg.producto}, {stock: nuevo_stock})
            res.status(200).send({ data: reg})
        }else{
            res.status(500).send({message: 'No access'})
        }
    }else{
        res.status(500).send({message: 'No access'})
    }

}

module.exports = {
    registro_producto,
    listar_producto_admin,
    obtener_imagen,
    obtener_producto_admin,
    actualizar_producto,
    elimiar_producto,
    listar_inventario,
    eliminar_inventario,
    registro_inventario_producto
}