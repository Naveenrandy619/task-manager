const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL,{
    
})

// const me = new User({
//     name : 'Rey',
//     age : 27,
//     password : 'Millionaire'
// })

// me.save().then(()=>{
//     console.log(me);
// }).catch((error)=>{
//     console.log(error);
// })