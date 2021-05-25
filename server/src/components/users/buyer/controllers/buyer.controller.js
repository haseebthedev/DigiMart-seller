const Buyer = require('../models/buyer.model')
const passwordGenerator = require('generate-password');
const userEmail = require('../../../notifications/account')
const notification = require('../../../notifications/account')

const registerBuyer = async (req,res,next) => {
    
    const buyer=new Buyer(req.body)
    try{
        await buyer.save()
        const token=await buyer.generateAuthToken()
        //send registration mail
        const subject = 'Digi-Mart Customer Registration Email'
        const message = `Thank you for creating your account on Digi-Mart.<br>
        Now you are a part of Digi-Mart family. You can buy any product by just one click and it will be delivered on your door step. 
        <br><strong>Thank you again for your time.</strong>`
        notification.sendRegistrationMail(buyer.email,subject,message,buyer.name)
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

const updateAccountPassword = async(req, res, next) => {
    try{
        const user = req.user
        user['password'] = req.body.password
        await user.save()
        //send new password email to user
        //userEmail.sendForgetPasswordMail(user.email,password)
        return res.status(200).json({
            message:`User Password have been updated successfully.`,
            data:{
                email: req.user.email,
                pass: password
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const forgetAccountPassword = async(req, res, next) => {
    try{
        const password = passwordGenerator.generate({
            length: 8,
            numbers: true
        });
        const email = req.body.email
        const user = await Buyer.findOne({email: email})
        user['password'] = password
        await user.save()
        //send new password email to user
        userEmail.sendForgetPasswordMail(user.email,user.name,password)
        return res.status(200).json({
            message:`User Password have been updated successfully.`,
            data:{
                email: email,
                name: user.name
            }
        })
    }
    catch(e){
        e.status = 404
        e.message = 'No user with this email exists! Please enter valid email.'
        next(e)
    }
}

module.exports = {
    registerBuyer,
    loginBuyer,
    logoutBuyer,
    activateMyAccount,
    deActivateMyAccount,
    deleteMyAccount,
    forgetAccountPassword
}