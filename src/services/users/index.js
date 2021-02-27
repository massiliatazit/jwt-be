const express = require('express');
const router = express.Router()
const UserModel = require("./schema")
const {adminOnly,authorize}=require('../auth/middleware')
const {authenticate,refreshToken} = require('../auth/tools')
router.get("/",authorize,async(req,res,next)=>{
  //  console.log("user",req.user)
    try {
        const users = await UserModel.find()
        console.log("users",users)
        res.send(users)
        
    } catch (error) {
        console.log(error)
        next(error)
        
    }
})
router.post("/register",async(req,res,next) => {
    try {
        const newUser = new UserModel(req.body)
        const {_id}= await newUser.save()
        res.status(201).send(_id)
        
    } catch (error) {
        console.log(error)
        next(error)
        
    }
})
router.get("/me",async(req,res,next)=>{
    try {
        res.send(req.user)
        
    } catch (error) {
        next(error)
        
    }

})
router.put("/me", async(req,res,next)=>{
    try {
        const updates = Object.keys(req.body)
        updates.forEach(update=>req.user[update]=req.body[update])
        await req.user.save()
        res.status(201).send(req.user)
        
    } catch (error) {
        next(error)
    }

})
router.delete("/me", async(req,res,next)=>{
    try {
        await req.user.deleteOne(res.send("Deleted")
            )
        
    } catch (error) {
        next(error)
        
    }
})
router.post("/login",async(req, res, next)=>{
    try {
        //check credentials
        const {email,password} =req.body
        const user = await UserModel.findByCredentials(email,password)
        console.log("here user",user)
        //generate token
        const tokens = await authenticate(user)
        //send back token
        res.send(tokens)
    } catch (error) {
        next(error)
        
    }
})
router.post("/refreshToken",async(req, res, next)=>{
    try {
        //1.Generate token
        const oldRefreshToken = req.body.refreshToken
        //2.verify token
        // 3. if it's ok generate new access token and new refresh token 
        const {token,RefreshToken}= await refreshToken(oldRefreshToken)
        //4. send the tokens back  
        res.send({token,RefreshToken})     
    } catch (error) {
        next(error)
        
    }
})
module.exports=router