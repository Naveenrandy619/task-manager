const express = require("express");
const User = require("../models/users");
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router();

router.post("/users", async (req, res) => {
    console.log("User creation entryyy");
    console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken()
    console.log("User creation saved");
    res.status(200).send({user, token});
  } catch {
    res.send(e);
  }
});

router.post('/users/login', async (req,res) => {
    try{
        console.log("Login entryy");
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({user, token})
    }
    catch(e){
        res.send(e)
    }
})


router.post('/users/logout',auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(404).send()
    }
})

const upload = multer({
  limits : {
    fileSize : 1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
     return cb(new Error('Please attach image formats'))
    }
    cb(undefined,true)
  }
})

router.post('/users/me/avatar',auth, upload.single('avatar'), async (req,res)=>{
  const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next) =>{
  res.status(404).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async(req,res)=>{
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
});

router.get('/users/:id/avatar', async (req,res) => {

  try{
  const user = await User.findById(req.params.id)
  if(!user || !user.avatar){
    throw new Error()
  }

  res.set('Content-Type','image/png')
  res.send(user.avatar)}

  catch(e){
    res.status(404).send()
  }}
  )
  

router.patch("/users/:id", auth, async (req, res) => {

  const updates = Object.keys(req.body)
  const validators = ["name", "age", "password", "email"];
  const isValidOps = updates.every((update) => validators.includes(update));

  if (!isValidOps) {
    return res.status(201).send("Not a valid operation");
  }
  updates.forEach((update) => (req.user[update] = req.body[update]));
  await req.user.save();
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
   await req.user.remove()
   res.send(req.user)
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
