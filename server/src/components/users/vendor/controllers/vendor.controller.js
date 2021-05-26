const Vendor = require('../models/vendor.model')
const passwordGenerator = require('generate-password');
const notification = require('../../../notifications/account')

const registerVendor = async(req, res, next) => {
    const vendor=new Vendor(req.body)
    try{
        await vendor.save()
        const token=await vendor.generateAuthToken()
        //send registration mail
        const subject = 'Digi-Mart Seller Registration Email'
        const message = `You have successfully registered your Email ${vendor.email} with Digi-Mart.
        To sell products and make money, register your store '${vendor.storeName}' on Digi-Mart by providing necessary details and be part of Digi-Mart seller family.
        <br><strong>Thank you for your time.</strong>`
        notification.sendRegistrationMail(vendor.email,subject,message,vendor.name)
        res.status(201).json({
            message:`${vendor.name} your request for registration has been sent successfully!`,
            data:{
                vendor: vendor,
                token: token
            }
        })
    }
    catch (err){
        //err.message='not added'
        err.status = 402
        next(err)
    }
}

const loginVendor = async (req, res, next) => {
    try{
        const vendor=await Vendor.findByCredientials(req.body.email,req.body.password)
        const token=await vendor.generateAuthToken()
        res.json({
            message:`You are logged in successfully! Welcome to DigiMart.`,
            data:{
                vendor: vendor,
                token:token
            }
        })
    }
    catch(e){
            e.status = 404
            next(e)
    }
}

const logoutVendor = async(req, res, next) => {
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
        e.status = 402
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
        e.status = 402
        next(e)
    }
}

const addBankDetails = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        const allowedUpdated=['routingNumber','accountNumber','bankName','bankHolderName','isStoreRegistered']
        const isValidOperation=updates.every((update) => allowedUpdated.includes(update))
        if(!isValidOperation){
            throw new Error('Error:Please enter valid update!')
        }
        const user = req.user
        updates.forEach((update)=>user[update]=req.body[update])
        await user.save()
        return res.status(200).json({
                message:`Bank Details have been updated successfully.`,
                data:{
                    email: req.user.email
                }
        })
    }
    catch(e){
        e.status = 402
        next(e)
    }
}

const updateAccountPassword = async(req, res, next) => {
    try{
        const user = req.body.password
        user['password'] = password
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
        const user = await Vendor.findOne({email: email})
        user['password'] = password
        await user.save()
        //send new password email to user
        notification.sendForgetPasswordMail(user.email,user.name,password)
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

const updateProfile = async(req, res, next) => {
    try{
        const updates=Object.keys(req.body)
        const allowedUpdated=['name','email','password','gender','phoneNumber','birthday',
        'accountNumber','routingNumber','bankHolderName','bankName','CNIC','storeName',
        'isStoreRegistered','profilePic','isNotificationsEnabled','isDarkModeEnabled']
        const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
        if(!isValidOperation || updates.length == 0){
            throw new Error('Invalid Keys! Please enter valid keys.')
        }
        const user = req.user
        //we use bracket notation to update property dynamically
        //bcz we dont know user is going to update name,email etc
        updates.forEach((update) => user[update]=req.body[update])
        await user.save()
        if(!user){
            throw new Error('User not found!')
        }
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

const getPersonalDetails = async(req, res, next) => {
    try{
        const vendor = req.user
        //console.log(vendor)
        res.status(201).send({
            message: `Store data fetched Successfully!`,
            data: {
                accountNumber: vendor.accountNumber,
                routingNumber: vendor.routingNumber,
                bankHolderName: vendor.bankHolderName,
                bankName: vendor.bankName
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

module.exports={
    registerVendor,
    loginVendor,
    logoutVendor,
    deleteMyAccount,
    deActivateMyAccount,
    activateMyAccount,
    addBankDetails,
    forgetAccountPassword,
    updateProfile,
    getPersonalDetails
}