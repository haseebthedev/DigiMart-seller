const jwt=require('jsonwebtoken')
const Admin = require('../models/admin.model')

const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.JWT_ADMIN_CODE)
        const user=await Admin.findOne({_id:decoded._id , 'tokens.token':token})

        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    }
    catch(e){
        e.status = 401
        e.message = 'Sorry! You are not Authorized.'
        next(e)
    }
   
}
module.exports = auth