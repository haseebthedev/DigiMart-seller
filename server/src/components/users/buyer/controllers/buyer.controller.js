const Buyer = require('../models/buyer.model')
const Store = require('../../../store/model/store.model')
const userEmail = require('../../../notifications/account')
const bcrypt=require('bcryptjs')
const notification = require('../../../notifications/account')

const registerBuyer = async (req,res,next) => {
    
    const buyer=new Buyer(req.body)
    try{
        await buyer.save()
        const token = await buyer.generateAuthToken()
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
        //check if buyer blocked then send error
        if(buyer.isAccountBlocked == true){
            throw new Error('Your account has been blocked by Admin !')
        }
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
        // console.log(updates.length)
        // const allowedUpdated=['name','email','password','gender','phoneNumber','birthday',
        // 'accountNumber','profilePic','isNotificationsEnabled','isDarkModeEnabled']
        // const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        // if(!isValidOperation || updates.length == 0){
        //     throw new Error('Invalid Keys! Please enter valid keys.')
        // }
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

const subscribeStoreByStoreId = async(req, res, next) => {
    try{
        const storeId = req.body.storeId
        const user = req.user
        user.subscribedStores.push(storeId)
        await user.save()
        //send email here
        return res.status(200).json({
            message:`Subscribed to store successfully successfully.`,
            data:{
                subscribers: req.user.subscribedStores
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const UnSubscribeStoreByStoreId = async(req, res, next) => {
    try{
        const storeId = req.body.storeId
        const user = req.user
        user.subscribedStores = user.subscribedStores.filter((subscribedStoreId) => {
            return storeId != subscribedStoreId
        })
        await user.save()
        //send email here
        return res.status(200).json({
            message:`UnSubscribed to store successfully successfully.`,
            data:{
                subscribers: req.user.subscribedStores
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const ViewSubscribedStores = async(req, res, next) => {
    try{
        const user = req.user
        const subscribedStoresIds = user.subscribedStores
        //get all  details of subscribed stores
        const subscribedStores = await Store.find({'_id': { $in: subscribedStoresIds }})
        //send email here
        return res.status(200).json({
            message:`Subscribed stores fetched successfully.`,
            data:{
                subscribedStores
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
        
        const email = req.body.email
        const user = await Buyer.findOne({email: email})
        if(!user){
            throw new Error('No user with this email exists! Please enter valid email.')
        }
        //Generate and set password reset token
        user.generatePasswordReset();
        //save new user obj
        await user.save()
        //reset password link
        let link = "http://" + req.headers.host + "/buyer/reset/password/auth/" + user.resetPasswordToken;
        //send reset password link to user via. email
        userEmail.sendForgetPasswordMail(user.email,user.name,link)
        return res.status(200).json({
            message:`Reset password link is sent to email.`,
            data:{
                email: email,
                name: user.name
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const resetPassword = async(req, res, next) => {
    try{

        const buyer = await Buyer.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
        if(!buyer){
            throw new Error("Password reset token is invalid or has expired.")
        }

        //Set the new password
        buyer.password = req.body.password;
        buyer.resetPasswordToken = undefined;
        buyer.resetPasswordExpires = undefined;
        //logout from all devices
        buyer.tokens = []
        //save user
        await buyer.save()

        //send change password mail here
        const subject = 'Account Password Updated'
        const message = `<strong>This is a confirmation mail.</strong><br>
        Your account password has been updated successfully.<br>
        `
        notification.sendNotificationMail(buyer.email,subject,message,buyer.name)

        return res.status(200).json({
            message:`User Password has been updated successfully.You are Logged out from all devices. Sign in again by entering new password.`,
            data:{
                user: buyer.email
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const viewMyProfileInfo = async (req, res, next) => {
    try{
        const _id = req.user._id
        const buyer = await Buyer.find({_id: _id})
        if(buyer.length == 0){
            throw new Error('No buyer find of this id !')
        }
        res.status(200).json({
            message:`Buyer fetched successfully!.`,
            data:{
                buyer
            }
        })
    }
    catch(e){
        e.status = 404
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

const blockBuyerById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const buyer = await Buyer.findById(_id)
        if(buyer.length == 0){
            throw new Error('No buyer find of this id !')
        }
        buyer.isAccountBlocked = true
        //logout buyer from all devices
        buyer.tokens = []
        await buyer.save()
        res.status(200).json({
            message:`Buyer blocked successfully!.`,
            data:{
                buyer
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}


const unBlockBuyerById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const buyer = await Buyer.findById(_id)
        if(buyer.length == 0){
            throw new Error('No buyer find of this id !')
        }
        buyer.isAccountBlocked = false
        await buyer.save()
        res.status(200).json({
            message:`Buyer unblocked successfully!.`,
            data:{
                buyer
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const viewBuyerById = async (req, res, next) => {
    try{
        const _id = req.params.id
        const buyer = await Buyer.find({_id: _id})
        if(buyer.length == 0){
            throw new Error('No buyer find of this id !')
        }
        res.status(200).json({
            message:`Buyer fetched successfully!.`,
            data:{
                buyer
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const editBuyerById = async(req, res, next) => {
    try{
        const id = req.params.id
        const updates=Object.keys(req.body)
        // const allowedUpdated=['name','email','password','gender','phoneNumber','birthday',
        // 'accountNumber','profilePic','isNotificationsEnabled','isDarkModeEnabled']
        // const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        // if(!isValidOperation || updates.length == 0){
        //     throw new Error('Invalid Keys! Please enter valid keys.')
        // }
        const user = await Buyer.findById(id)
        if(user.length == 0){
            throw new Error('No buyer find of this id !')
        }
        if(req.body.isAccountBlocked){
            //logout buyer from all devices
            user.tokens = []
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        //send email here
        return res.status(200).json({
            message:`Buyer Profile has been updated successfully.`,
            data:{
                buyer: user
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const addSubscribeStoreOfBuyerByBuyerId = async(req, res, next) => {
    try{
        const storeId = req.body.storeId
        const userId = req.params.id
        const user = await Buyer.findById(userId)
        user.subscribedStores.push(storeId)
        await user.save()
        //send email here
        return res.status(200).json({
            message:`Subscribed to store successfully successfully.`,
            data:{
                buyer: user
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const UnSubscribeStoreOfBuyerByBuyerId = async(req, res, next) => {
    try{
        const storeId = req.body.storeId
        const userId = req.params.id
        const user = await Buyer.findById(userId)
        user.subscribedStores = user.subscribedStores.filter((subscribedStoreId) => {
            return storeId != subscribedStoreId
        })
        await user.save()
        //send email here
        return res.status(200).json({
            message:`UnSubscribed to store successfully successfully.`,
            data:{
                buyer: user
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}


const ViewSubscribedStoresOfBuyerByBuyerId = async(req, res, next) => {
    try{
        const userId = req.params.id
        const user = await Buyer.findById(userId)
        const subscribedStoresIds = user.subscribedStores
        //get all  details of subscribed stores
        const subscribedStores = await Store.find({'_id': { $in: subscribedStoresIds }})
        //send email here
        return res.status(200).json({
            message:`Subscribed stores fetched successfully.`,
            data:{
                subscribedStores
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

//FOR SELLER
const getAllBuyersDetailsForSeller = async(req, res, next) => {
    try{
        const filters = {}
        const Buyers = await Buyer.find(filters).select({'_id':1, 'name':1, 'email':1})
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

const searchBuyerByName = async(req, res, next) => {
    try{
        let name = req.params.name
        if(name){
            name = { '$regex': `.*${name}.*` }
        }
        const Buyers = await Buyer.find({name}).select({'_id':1, 'name':1, 'email':1})
        return res.status(200).json({
            message:`Searched Buyers data fetched successfully!.`,
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

const searchBuyerByAnything = async(req, res, next) => {
    try{
        let searchParameter = req.params.query
        if(searchParameter){
            query = { '$regex': `.*${searchParameter}.*` }
        }
        //check if name matching
        let Buyers = await Buyer.find({name: query})
        //check if email matching
        if(Buyers.length == 0){
            Buyers = await Buyer.find({email: query})
        }
        //check if number matching
        if(Buyers.length == 0){
            Buyers = await Buyer.find({phoneNumber: query})
        }
        return res.status(200).json({
            message:`Searched Buyers data fetched successfully!.`,
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
    subscribeStoreByStoreId,
    UnSubscribeStoreByStoreId,
    ViewSubscribedStores,
    viewMyProfileInfo,
    resetPassword,
    //for admin
    getAllBuyersDetails,
    getTotalNumberOfBuyers,
    blockBuyerById,
    unBlockBuyerById,
    viewBuyerById,
    editBuyerById,
    addSubscribeStoreOfBuyerByBuyerId,
    ViewSubscribedStoresOfBuyerByBuyerId,
    UnSubscribeStoreOfBuyerByBuyerId,
    //for seller
    getAllBuyersDetailsForSeller,
    searchBuyerByName,
    searchBuyerByAnything,
    searchBuyerByAnything
}