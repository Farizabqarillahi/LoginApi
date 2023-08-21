//tata atur user

const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new schema ({
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    repeat_password:{
        type: String
    },
    isAdmin:{
        type: Boolean,
        required: true
    }
})

//untuk hash password
userSchema.pre('save', async function (next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        const hashedRepeatPassword = await bcrypt.hash(this.repeat_password, salt)
        this.password = hashedPassword
        this.repeat_password = hashedRepeatPassword
        next()
    }catch(error){
        next(error)
    }
})


//untuk mmvalidasi password
userSchema.methods.isValidPassword = async function (password){
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

userSchema.methods.isValidRole = async function (isAdmin){
    try {
        return await isAdmin === this.isAdmin
    } catch (error) {
        throw error
    }
}   


const user = mongoose.model('user', userSchema)
module.exports = user
