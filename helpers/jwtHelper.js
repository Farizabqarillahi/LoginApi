//file untuk generate dan vaildate access token dan refresh token

const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('./initRedis')

module.exports = {
    signAccessToken: (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: '10m',
                issuer: 'websitebuilder.com',
                audience: userID
            }
            jwt.sign(payload, secret, options, (err, token) => {
                if(err){
                    console.log(err.message)
                    reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err){
                if(err.name === 'JsonWebTokenError'){
                    return next(createError.Unauthorized())
                } else {
                    return next(createError.Unauthorized(err.message))
                }
            }
            req.payload = payload
            next()
        })
    },
    signRefreshToken: (userID) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: '1y',
                issuer: 'websitebuilder.com',
                audience: userID
            }
            jwt.sign(payload, secret, options, (err, token) => {
                if(err){
                    console.log(err.message)
                    reject(createError.InternalServerError())
                }

                client.SET(userID, token, 'EX', 365*24*60*60, (err, reply) => {
                    if(err){
                        console.log(err.message)
                        reject(createError.InternalServerError())
                        return
                    }
                    resolve(token)
                })
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if(err) return reject(createError.Unauthorized())
                const userID = payload.aud
                client.GET(userID, (err, result) => {
                    if(err) {
                        console.log(err.message)
                        reject(createError.InternalServerError())
                        return
                    }
                    if(refreshToken === result) return resolve(userID)
                    reject(createError.Unauthorized())
                })
            })
        })
    }
}