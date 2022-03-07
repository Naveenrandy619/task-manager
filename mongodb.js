const { ObjectID } = require('bson')
const mongodb = require('mongodb')
const MongoCleint = mongodb.MongoClient

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoCleint.connect(connectionUrl, {useNewUrlParser : true},(error,client)=>{
    if(error){
        return console.log('Unable to connect...');
    }
    const db = client.db(databaseName)

//   const updatePromise = db.collection('users').updateOne({
//        _id : new ObjectID("621370b1f91ec90cf4bc688a")
//    },{
//        $set :{
//            name : "Balor"
//        }
//    })

//    updatePromise.then((result)=>{
//        console.log(result);
//    }).catch((error)=>{
//        console.log(error);
//    })

db.collection('users').deleteMany({
    age : 26
}).then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(error);
})

})