//kodingan

const createError = require('http-errors')
const User = require('../models/userModels')
const {authSchema} = require('../helpers/validationSchema')
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwtHelper')
const client = require('../helpers/initRedis')


module.exports = {
    register: async(req, res, next) => {
        try{
            const result = await authSchema.validateAsync(req.body)
            console.log(result) 
            
            const doesExist = await User.findOne({email: result.email})
            if(doesExist) throw createError.Conflict(`The email ${result.email} has already registered`)
            if(result.repeat_password != result.password) {
                throw createError.Conflict('Please confirm your password')
            }
            const user = new User(result)
            const savedUser = await user.save()
    
            const accessToken = await signAccessToken(savedUser.id)
            const refreshToken = await signRefreshToken(savedUser.id)
            res.status(200).json({ success: true, message:{id: "Berhasil", en:"Success"}, accessToken, refreshToken });
        } catch(error){
            if(error.isJoi === true) error.status = 422
            next(error)
        }
    },

    login: async(req, res, next) => {
        try{
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({email: result.email})
            // const admin = await User.findOne({isAdmin: result.isAdmin})
            const isMatch = await user.isValidPassword(result.password)
            // const isRole = await user.isValidRole(result.isAdmin)
            
            if(!user) throw createError.NotFound("User not registered")
            if(!isMatch) throw createError.Unauthorized("Username/Password is Invalid")
            // if(!isRole) throw createError(500, 'Internal Server Error')
    
            const accessToken = await signAccessToken(user.id)
            const refreshToken = await signRefreshToken(user.id)
            // const adminStatus = result.isAdmin

            res.status(200).json({ success: true, message:{id: "Berhasil", en:"Success"}, accessToken, refreshToken });
        }catch(error){
            if(error.isJoi === true){
                return next(createError.BadRequest('Invalid Username/Password'))
            }
            next(error)
        }
    },

    refreshToken: async(req, res, next) => {
        try {
            const { refreshToken } = req.body
            if(!refreshToken) throw createError.BadRequest()
            const userID = await verifyRefreshToken(refreshToken)
    
            const accessToken = await signAccessToken(userID)
            const reefreshToken = await signRefreshToken(userID)
            res.send({accessToken: accessToken, refreshToken: reefreshToken})
        } catch (error) {
            next(error)
        }
    },

    logout: async(req, res, next) => {
        try {
            const {refreshToken} = req.body
            if(!refreshToken) throw createError.BadRequest()
            const userID = await verifyRefreshToken(refreshToken)
            client.DEL(userID, (err, value) => {
                if(err){
                    console.log(err.message)
                    throw createError.InternalServerError()
                }
                console.log(value)
                res.sendStatus(204)
                // res.status(200).json({ success: true, message:{id: "Berhasil", en:"Success"}, accessToken, refreshToken });
            })

        } catch (error) {
            next(error)
        }
    }
}