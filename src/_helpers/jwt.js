const expressJwt = require('express-jwt')
const config = require('../config.json')
const User = require('../components/users/users.model')

module.exports = jwt

function jwt() {
    const secret = config.secret
    return expressJwt( {secret, isRevoked} ).unless({
        path: [
            // public routes that don't require authentication
            '/users/login',
            '/users/registration'
        ]
    })
}

async function isRevoked(req, payload, done) {
    const user = await User.findById(payload.sub)
    req.User = user
    if (!user) {
        return done(null, true)
    }

    done()
}
