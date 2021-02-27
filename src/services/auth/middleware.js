const UserModel = require("../users/schema");
const jwt = require("jsonwebtoken")
const {verifyJWT} = require("./tools")



const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ","")
    const decoded = await verifyJWT(token)
    const user = await UserModel.findOne({_id:decoded._id})
    req.user = user
  } catch (error) {
    const err = new Error(("Authenticate first please!"))
    err.httpStatusCode = 401
    next(error)
    
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
   
    adminOnly: admintest,
    authorize

}