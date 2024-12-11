const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => { // access token 
    return jwt.sign({
        email: user.email,
    }, 'access', {expiresIn: '14d'});
}


const generateRefreshToken = (user) => { // refresh token 
    return jwt.sign({
        email: user.email,
    }, 'refresh', {expiresIn: '14d'});
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
}