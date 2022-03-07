const express = require("express");
require("./database/mongoose");
const User = require("./models/users");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task")

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(taskRouter)
const port = process.env.PORT

const multer = require('multer')
const upload = multer({
  dest : 'images',
  limits :{
    fileSize : 1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg)$/)){
     return  cb(new Error('Please attach word format'))
    }
    cb(undefined,true)
  }
})

app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
})


app.listen(port, () => {
  console.log("Serverr runninggg...");
});
