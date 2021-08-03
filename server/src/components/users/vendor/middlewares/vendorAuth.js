const jwt=require('jsonwebtoken')
const Vendor = require('../models/vendor.model')
const Store = require('../../../store/model/store.model')

const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.JWT_VENDOR_CODE)
        const user=await Vendor.findOne({_id:decoded._id , 'tokens.token':token})
        if(!user){
            throw new Error()
        }
        //here write code to query store and get store details by 
        //using store _id and put req.store = store
        req.user = user
        req.token = token
        if(user.storeId){
            const store = await Store.findOne({_id: user.storeId})
            req.store = store
        }
        next()
    }
    catch(e){
        e.status = 401
        e.message = 'Sorry! You are not Authorized.'
        next(e)
    }
   
}
module.exports=auth