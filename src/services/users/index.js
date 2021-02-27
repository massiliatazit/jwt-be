const express = require('express');
const router = express.Router()
const UserModel = require("./schema")
const {adminOnly}=require('../auth/middleware')
const {authenticate} = require('../auth/tools')
router.get("/", adminOnly,async(req,res,next)=>{
  //  console.log("user",req.user)
    try {
        const users = await UserModel.find()
        console.log("users",users)
        res.send(req.user)
        
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
        //generate token
        const accessToken = await authenticate(user)
        //send back token
        res.send({accessToken})
    } catch (error) {
        next(error)
        
    }
})
module.exports=router