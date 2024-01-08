
const jwt = require('jwt-simple')
const moment =  require('moment')
const secret = 'samuel29'

exports.createToken = function(user) {
    const payload = {
        sub: user._id,
        nombre: user.nombre,
        apellifos: user.apellidos,
        email: user.email,
        role: user.rol,
        iat: moment().unix(),
        exp: moment().add(7,'days').unix()
    }
    return jwt.encode(payload,secret)
}