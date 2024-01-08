var jwt = require('jwt-simple');
var moment = require('moment');
const secret = 'samuel29'


exports.auth = function(req,res,next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'})
    }
    const token = req.headers.authorization.replace(/['"]+/g,'')
    const segment = token.split('.')
    if(segment.length !== 3) {
        return res.status(403).send({message: 'Token incorrecto'})
    }else {
        try{
            var payload = jwt.decode(token,secret)
            if(payload.exp <= moment().unix()) {
                return res.status(403).send({message: 'Token expirado'})
            }
        }catch(ex) {
            return res.status(403).send({message: 'Token incorrecto'})
        }
    }
    req.user = payload

    next()
}