const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = new mongoose.Schema({
    name : {
        type : String
    },
    age : {
        type : Number
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String,
        require : true,
        minlength : 7,
        trim : true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Errorrrr..')
            }
        }
    },
    tokens : [{
        token : {
            type : String,
            require : true
        }
    }],
    avatar : {
        type : Buffer
    }
},
{
    timestamps : true
})

userSchema.virtual('tasks',{
     ref : 'Task',
     localField : '_id',
     foreignField : 'owner'
 })

userSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}


userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, 'Millionaire')

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login...')
    }
    const isMatch = bcryptjs.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login...')
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcryptjs.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove', async function(next){
    const user = this

   await Task.deleteMany({owner : user._id})
    
    next()
})


const User = mongoose.model('User',userSchema)

module.exports = User