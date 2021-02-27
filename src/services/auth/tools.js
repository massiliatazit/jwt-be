const jwt = require("jsonwebtoken");
const User = require("../users/schema");
const authenticate = async user => {
  try { const newAccessToken = await generateJWT({_id:user._id})
  const newRefreshToken = await generateRefreshJWT({_id:user._id})
  user.refreshTokens = user.refreshTokens.concat({token:newRefreshToken})
  await user.save()
   return {newAccessToken,newRefreshToken}

  } catch (error) {
      console.log(error)
      throw new Error(error)
  }
};

//generate token
const generateJWT= payload => new Promise((res,rej)=> jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2 week"},(err,token)=>{
    if(err) rej(err);
    res(token)
}))
//generate refrech token
const generateRefreshJWT= payload => new Promise((res,rej)=> jwt.sign(payload,process.env.REFRESH_JWT_SECRET,{expiresIn:"1 week"},(err,token)=>{
    if(err) rej(err);
    res(token)
}))
verifyJWT = token=> new Promise ((res,rej)=>jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    if(err) rej(err)
    res(decoded)
   
}))
verifyRefreshToken = token=> new Promise ((res,rej)=>jwt.verify(token,process.env.REFRESH_JWT_SECRET,(err,decoded)=>{
    if(err) rej(err)
    console.log("here decoded refToken",decoded)
    res(decoded)
}))
const refreshToken= async oldRefreshToken =>{
  try {
        //verify old Refresh Token
    const decoded = await verifyRefreshToken(oldRefreshToken)
    //check if old refresh token is in DB
    const user = await User.findOne({_id:decoded._id}) 
    const currentRefreshToken = await user.refreshTokens.find(token=>token.token=== oldRefreshToken)
    if (!currentRefreshToken){ throw new Error("wrong refresh token provided")}
    //if everything is ok we can generate a new access and refresh token
    const newAccessToken = await generateJWT({_id:user._id})
  const newRefreshToken = await generateRefreshJWT({_id:user._id})
  // replace old refresh token with new one in the DB
  const newRefreshTokensList = user.refreshTokens.filter(token=>token.token !== oldRefreshToken).concat({token:newRefreshToken})
  user.refreshTokens=[...newRefreshTokensList]
  await user.save()
      return {token:newAccessToken,RefreshToken:newRefreshToken}
  } catch (error) {
      console.log(error)
      
  }

}
module.exports ={authenticate,verifyJWT,refreshToken}