const jwt = require("jsonwebtoken");
const User = require("../users/schema");
const authenticate = async user => {
  try { const newAccessToken = await generateJWT({_id:user._id})
  const newRefreshToken = await generateRefreshJWT({_id:user._id})
   return newAccessToken

  } catch (error) {
      console.log(error)
      throw new Error(error)
  }
};

//generate token
const generateJWT= payload => new Promise((res,rej)=> jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:6},(err,token)=>{
    if(err) rej(err);
    res(token)
}))
//generate refrech token
const generateRefreshJWT= payload => new Promise((res,rej)=> jwt.sign(payload,process.env.REFRESH_JWT_SECRET,{expiresIn:"1 week"},(err,token)=>{
    if(err) rej(err);
    res(token)
}))

module.exports ={authenticate}