const jwt=require('jsonwebtoken')
const SuperAdmin = require('../models/superAdmin.model')

const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.JWT_SUPER_ADMIN_CODE)
        const user=await SuperAdmin.findOne({_id:decoded._id , 'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    }
    catch(e){
        e.status = 401
        e.message = 'Sorry! You are not Authorized as Super Admin.'
        next(e)
    }
   
}
module.exports = auth