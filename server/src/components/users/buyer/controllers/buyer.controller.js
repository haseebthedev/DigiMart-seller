const Buyer = require('../models/buyer.model')
const passwordGenerator = require('generate-password');
const userEmail = require('../../../notifications/account')
const bcrypt=require('bcryptjs')
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
        notification.sendNotificationMail(buyer.email,subject,message,buyer.name)
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
        buyer.isAccountActive = true
        await buyer.save()
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
        const buyer = req.user
        await req.user.remove()

        //later add this
        //if buyer delete .. delete its orders, reviews etc.

        //send deletion mail
        const subject = 'Account Deletion Email'
        const message = `Your account registered on ${buyer.email} has been removed from Digi-Mart. 
        We recieved your reason behind account deletion and our team will work on it. We will miss you 
        ${buyer.name}. Hope you will soon be part of Digi-Mart family again.
        <br><strong>Thank you for your time.</strong>`
        notification.sendNotificationMail(buyer.email,subject,message,buyer.name)
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
        const buyer = req.user
        req.user.isAccountActive = false;
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            return tokens.token !== req.token
        })
        await req.user.save()
        
        //send deactivation mail
        const subject = 'Account Deactivation Email'
        const message = `Your account registered on ${buyer.email} has been deactivated temporily. 
        You can activate your account anytime by logging in from your credentials. ${buyer.name} we hope you will activate your account 
        soon again and be part of Digi-Mart family.
        <br><strong>Thank you for your time.</strong>`
        notification.sendNotificationMail(buyer.email,subject,message,buyer.name)

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

const updateProfile = async(req, res, next) => {
    try{
        const updates=Object.keys(req.body)
        console.log(updates.length)
        const allowedUpdated=['name','email','password','gender','phoneNumber','birthday',
        'accountNumber','profilePic','isNotificationsEnabled','isDarkModeEnabled']
        const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        if(!isValidOperation || updates.length == 0){
            throw new Error('Invalid Keys! Please enter valid keys.')
        }
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        //send email here
        return res.status(200).json({
            message:`User Profile has been updated successfully.`,
            data:{
                user: req.user
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

const changePassword = async(req, res, next) => {
    try{
        const user = req.user
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword
        const isMatch= await bcrypt.compare(oldPassword,user.password)
        if(!isMatch || !oldPassword || !newPassword){
        throw new Error('Invalid password Entered!')
        }
        //update password
        user['password'] = newPassword
        await user.save()
        //send change password mail here
        return res.status(200).json({
            message:`User Password has been updated successfully.`,
            data:{
                user: req.user
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

//ROUTES FOR ADMIN

const getAllBuyersDetails = async(req, res, next) => {
    try{
        const filters = {}
        const Buyers = await Buyer.find(filters)
        return res.status(200).json({
            message:`Buyers data fetched successfully!.`,
            data:{
                Buyers: Buyers
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getTotalNumberOfBuyers = async(req, res, next) => {
    try{
        const totalNumberOfBuyers = await Buyer.estimatedDocumentCount()
        return res.status(200).json({
            message:`Total number of buyers fetched successfully!.`,
            data:{
                totalNumber: totalNumberOfBuyers
            }
        })
    }
    catch(e){
        e.status = 404
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
    forgetAccountPassword,
    updateProfile,
    changePassword,
    //for admin
    getAllBuyersDetails,
    getTotalNumberOfBuyers
}