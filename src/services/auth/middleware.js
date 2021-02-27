const UserModel = require("../users/schema");
const jwt = require("jsonwebtoken")



const authorize = async (req, res, next) => {
  try {
    
  } catch (error) {
    
  }
    
  }
  const admintest = async(req,res,next)=>{
      if (req.user && req.user.role === 'admin') {
          next()
      }else{
          const error = new Error("Not authorization access")
          error.httpStatusCode = 403
          next(error)
      }
  }
module.exports={
   
    adminOnly: admintest

}