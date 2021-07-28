const Vendor = require('../models/vendor.model')
const passwordGenerator = require('generate-password');
const bcrypt = require('bcryptjs')
const Product = require('../../../products/model/product.model')
const notification = require('../../../notifications/account');

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
        notification.sendNotificationMail(vendor.email,subject,message,vendor.name)
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
        err.status = 404
        next(err)
    }
}

const loginVendor = async (req, res, next) => {
    try{
        const isStoreRegistered = false
        const vendor=await Vendor.findByCredientials(req.body.email,req.body.password)
        const token=await vendor.generateAuthToken()
        // if store then activate store and vendor profile
        if(req.store){
            isStoreRegistered = true
            //activate account status
            vendor.isAccountActive = true;
            //save vendor
            await vendor.save()
            //activate store
            req.store.isActive = true
            //save store
            await req.store.save()
        }
        res.json({
            message:`You are logged in successfully! Welcome to DigiMart.`,
            data:{
                vendor: vendor,
                token:token,
                isStoreRegistered : isStoreRegistered
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
        const vendor = req.user
        if(!req.store)
        throw new Error('Store is not registered yet! Please register your store.')
        const store = req.store
        await req.user.remove()
        //later add this if vendor delete its reviews etc.
        //if vendor delete .. delete its store, products, reviews etc.
        const productsOfStore = await Product.find({storeID: store._id})
        await productsOfStore.remove()
        await store.remove()

        //send deletion mail
        const subject = 'Account Deletion Email'
        const message = `Your seller account registered on ${vendor.email} has been removed from Digi-Mart. 
        We recieved your reason behind account deletion and our team will work on it. Our customers will miss your store
        '${vendor.storeName}' products. Hope you will soon be part of Digi-Mart family again.
        <br><strong>Thank you for your time.</strong>`
        notification.sendNotificationMail(vendor.email,subject,message,vendor.name)

        res.status(200).json({
            message:`Account has been Deleted successfully.`,
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

const deActivateMyAccount = async(req, res, next) => {
    try{
        var isStoreRegistered = false
        const vendor = req.user
        //deactivate account status
        req.user.isAccountActive = false;
        //deactivate store
        if(req.store){
            isStoreRegistered = true
            req.store.isActive = false
            //we unpublish its all products
            const productsOfStore =  await Product.find({storeID: req.store._id})
            if(productsOfStore){
                productsOfStore.forEach(async(product) => {
                    product.isVisibilityEnabled = false
                    await product.save()
                })
            }
            //save store
            await req.store.save()
        }
        //logout
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            return tokens.token !== req.token
        })
        //save user
        await req.user.save()
        //send deactivation mail
        const subject = 'Account Deactivate Email'
        const message = `Your seller account registered on ${vendor.email} has been deactivated temporily. 
        You can activate your account anytime by logging in from your credentials. Hope you will activate your account 
        soon again and be part of Digi-Mart family.
        <br><strong>Thank you for your time.</strong>`
        notification.sendNotificationMail(vendor.email,subject,message,vendor.name)
        res.status(200).json({
            message:`Your account has been deactivated successfully. You can login again to activate it.`,
            data:{
                email: req.user.email,
                isStoreRegistered : isStoreRegistered
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const activateMyAccount = async(req, res, next) => {
    try{
        var isStoreRegistered = false;

        //if store, activate store
        if(req.store){
            isStoreRegistered = true
            //activate account status
            req.user.isAccountActive = true;
            //save user
            await req.user.save()
            //active store
            req.store.isActive = true
            //If products, then set its products visisble
            const productsOfStore =  await Product.find({storeID: req.store._id})
            if(productsOfStore){
                productsOfStore.forEach(async(product) => {
                    product.isVisibilityEnabled = false
                    await product.save()
                })
            }
            //save store
            await req.store.save()
        }
        else{
            throw new Error('Please register your store to activate account.')
        }
        
        res.status(200).json({
            message:`Account has been Activated successfully.`,
            data:{
                user: req.user,
                isStoreRegistered: isStoreRegistered
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const addBankDetails = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        //validations
        // const allowedUpdated=['routingNumber','accountNumber','bankName','AccountHolderName',
        // 'paymentMethod','isPrimaryAccount','paymentEmail','isStoreRegistered']
        // const isValidOperation=updates.every((update) => allowedUpdated.includes(update))
        // if(!isValidOperation){
        //     throw new Error('Please enter valid bank details!')
        // }
        const user = req.user
        //check if account already exists
        let isAccountAlreadyExists = false;
        user['PaymentAccounts'].forEach((account) => {
            if(account.accountNumber === req.body.accountNumber &&
               account.paymentMethod === req.body.paymentMethod){
                isAccountAlreadyExists = true;
            }
        })
        if(isAccountAlreadyExists)
        {
            throw new Error('Account already exists!')
        }
        //If primary, remove previous account from primary account
        if(req.body.isPrimaryAccount == true){
            user['PaymentAccounts'].forEach((account) => {
                account.isPrimaryAccount = false
            })
            await user.save()
        }
        //adding acccount in accounts array
        const addAccountDetails = await Vendor.findOneAndUpdate(
            { _id: user._id }, 
            { $push: { PaymentAccounts: req.body} 
            })
        return res.status(200).json({
                message:`Payment account has been updated successfully.`,
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
        const allowedUpdated=['name','email','password','gender','phoneNumber','birthday','CNIC',
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
            message: `Vendor data fetched Successfully!`,
            data: {
                vendor
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getBankDetails = async(req, res, next) => {
    try{
        const vendor = req.user
        //console.log(vendor)
        res.status(201).send({
            message: `Data fetched Successfully!`,
            data: {
                PaymentAccounts: vendor.PaymentAccounts
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const updateBankAccountDetailsById = async(req, res, next) => {
    try{
        let isAccountIdPresent = false
        const updates=Object.keys(req.body)
        const user = req.user
        const updateAccountId = req.params.id
        //find account of user using id
        user['PaymentAccounts'].forEach(async (account) => {
            if(account._id == updateAccountId){ 
                //If primary, remove previous account from primary account
                if(req.body.isPrimaryAccount == true){
                    user['PaymentAccounts'].forEach((account) => {
                        account.isPrimaryAccount = false
                    })
                }
                //update data of account
                isAccountIdPresent = true
                updates.forEach((update) => account[update]=req.body[update])

                await user.save()
                res.status(200).send({
                    message: `Payment Account updated Successfully!`,
                    data: {
                        account 
                    }
                })
            }
        })
        if(!isAccountIdPresent){
            throw new Error('Account not found !')
        }
        
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const deleteBankAccountById = async(req, res, next) => {
    try{
        let isAccountIdPresent = false
        const user = req.user
        const deleteAccountId = req.params.id
        //find if account Id present
        user['PaymentAccounts'].forEach(async (account) => {
            if(account._id == deleteAccountId){ 
                //update data of account
                isAccountIdPresent = true
            }
        })
        if(!isAccountIdPresent){
            throw new Error('Account not found !')
        }
        //filter account from all payment accounts and save
        user['PaymentAccounts'] = user['PaymentAccounts'].filter(function(account){
            return account._id != deleteAccountId; 
        });
        await user.save()
        res.status(200).send({
            message: `Payment Account deleted Successfully!`,
                data: {
                         
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

const getTotalNumberOfVendors = async(req, res, next) => {
    try{
        const totalNumberOfVendors = await Vendor.estimatedDocumentCount()
        return res.status(200).json({
            message:`Total number of Vendors fetched successfully!.`,
            data:{
                totalNumber: totalNumberOfVendors
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getAllVendorsDetails = async(req, res, next) => {
    try{
        const filters = {}
        const Vendors = await Vendor.find(filters)
        return res.status(200).json({
            message:`Vendors data fetched successfully!.`,
            data:{
                Vendors: Vendors
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const registerStore = async (req, res, next) => {
    try{
        const user = req.user
        user.isStoreRegistered = true
        await user.save()
        return res.status(200).json({
            message:`Store registered successfully!.`,
            data:{
                user
            }
        })
    }
    catch(e){
        e.status = 404
        next(e)
    }
}

module.exports={
    //for vendor
    registerVendor,
    loginVendor,
    logoutVendor,
    deleteMyAccount,
    deActivateMyAccount,
    activateMyAccount,
    addBankDetails,
    forgetAccountPassword,
    updateProfile,
    getPersonalDetails,
    changePassword,
    getBankDetails,
    updateBankAccountDetailsById,
    deleteBankAccountById,
    registerStore,
    //for admin
    getAllVendorsDetails,
    getTotalNumberOfVendors
}