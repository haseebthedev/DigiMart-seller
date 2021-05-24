const Buyer = require('../models/buyer.model')

const registerBuyer = async (req,res,next) => {
    
    const buyer=new Buyer(req.body)
    try{
        await buyer.save()
        const token=await buyer.generateAuthToken()
        res.status(201).json({
            message:`${buyer.name} you are registered successfully! Welcome to DigiMart.`,
            data:{
                buyer: buyer,
                token: token
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const loginBuyer = async (req, res, next) => {
    try{
        const buyer=await Buyer.findByCredientials(req.body.email,req.body.password)
        const token=await buyer.generateAuthToken()
        res.json({
            message:`You are logged in successfully! Welcome to DigiMart.`,
            data:{
                buyer: buyer,
                token:token
            }
        })
    }
    catch(e){
            e.status = 404
            next(e)
    }
}

const logoutBuyer = async(req, res, next) => {
    try{
        // it remove the token of device from which u logged in
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            //if tokens.token !== req.token it returns false filtering it out
            return tokens.token !== req.token
        })
        await req.user.save()
        res.status(200).json({
            message:`Logged out from the device successfully!`,
            data:{
                email: req.user.email
            }
        })
    }
    catch(e){
        e.status = 500
        next(e)
    }
}

const deleteMyAccount = async(req, res, next) => {
    try{  
        await req.user.remove()
        res.status(200).json({
            message:`Account has been Deleted successfully.`,
            data:{
                user: req.user
            }
        })
    }
    catch(e){
        res.status(500).send(e.message)
    }
}

const deActivateMyAccount = async(req, res, next) => {
    try{
        //deactivate account status
        req.user.isAccountActive = false;
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            return tokens.token !== req.token
        })
        await req.user.save()
        res.status(200).json({
            message:`Your account has been deactivated successfully. You can login again to activate it.`,
            data:{
                email: req.user.email
            }
        })
    }
    catch(e){
        e.status = 500
        next(e)
    }
}

const activateMyAccount = async(req, res, next) => {
    try{
        //activate account status
        req.user.isAccountActive = true;
        await req.user.save()
        res.status(200).json({
            message:`Account has been Activated successfully.`,
            data:{
                user: req.user
            }
        })
    }
    catch(e){
        e.status = 500
        next(e)
    }
}

module.exports = {
    registerBuyer,
    loginBuyer,
    logoutBuyer,
    activateMyAccount,
    deActivateMyAccount,
    deleteMyAccount
}