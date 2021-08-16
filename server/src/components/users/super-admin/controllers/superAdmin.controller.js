const SuperAdmin = require('../models/superAdmin.model')
const bcrypt=require('bcryptjs')
const notification = require('../../../notifications/account')

//FOR ADMIN's OWN PROFILE

const getMyDetails = async(req, res, next) => {
    try{
        const superAdminID = req.user._id
        const superAdmin = await SuperAdmin.find({_id:superAdminID})
        res.status(201).json({
            message: `SuperAdmin's data fetched Successfully!`,
            superAdmin: superAdmin
        })
    }
    catch(err){
        err.status = 404
        next(err)
    }
}

const loginSuperAdmin = async(req, res, next) => {
    try{
        const superAdmin=await SuperAdmin.findByCredientials(req.body.email,req.body.password)
        if(superAdmin.isAccountBlock){
            throw new Error('Sorry! Your account is Blocked')
        }
        const token=await superAdmin.generateAuthToken()
        superAdmin['isAccountActive'] = true
        res.json({
            message:`You are logged in successfully. Welcome to SuperAdmin Dashboard!.`,
            data:{
                superAdmin: superAdmin,
                token:token
            }
        })
    }
    catch(e){
            e.status = 404
            next(e)
    }
}

const logoutSuperAdmin = async(req, res, next) => {
    try{
        const superAdmin = req.user
        // it remove the token of device from which u logged in
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            //if tokens.token !== req.token it returns false filtering it out
            return tokens.token !== req.token
        })
        superAdmin['isAccountActive'] = false
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
//to decativate superAdmin's own profile
const deActivateMyAccount = async(req, res, next) => {
    try{
        const superAdmin = req.user
        //deactivate account status
        req.user.isAccountActive = false;
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            return tokens.token !== req.token
        })
        await req.user.save()

        //send deactivation mail
        const subject = 'Account Deactivation Email'
        const message = `Your account registered on ${superAdmin.email} has been deactivated temporily. 
        You can activate your account anytime by logging in from your credentials. ${superAdmin.name} we hope you have a good day.
        <br><strong>Thank you for your time.</strong>`
        notification.sendNotificationMail(superAdmin.email,subject,message,superAdmin.name)

        res.status(200).json({
            message:`Your account has been deactivated successfully. You can login again at any time to activate it.`,
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

//to activate superAdmin's own profile
const activateMyAccount = async(req, res, next) => {
    try{
        //deactivate account status
        req.user.isAccountActive = true;
        await req.user.save()
        res.status(200).json({
            message:`Account has been Activated successfully.`,
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
        const superAdmin = req.user
        await req.user.remove()

        //send deletion mail
        const subject = 'Account Deletion Email'
        const message = `Your account registered on ${superAdmin.email} has been removed from Digi-Mart. 
        Hope you will have a good day.
        <br><strong>Thank you for your time.</strong>`
        notification.sendNotificationMail(superAdmin.email,subject,message,superAdmin.name)        

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

const updateProfile = async(req, res, next) => {
    try{
        const updates=Object.keys(req.body)
        const allowedUpdated=['name','email','password','gender','phoneNumber','profilePic',
        'isNotificationsEnabled','isDarkModeEnabled','address']
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

//FOR OTHER SUPER ADMINs

const registerSuperAdmin = async(req, res, next) => {

    try{
        if(!req.user.role == "owner" || !req.user.role == "Owner"){
            throw new Error(' Sorry! you are Not authorized as owner')
        }
        const superAdmin = new SuperAdmin(req.body)
        await superAdmin.save()
        const token = await superAdmin.generateAuthToken()

        const subject = 'Digi-Mart SuperAdmin Registration Email'
        const message = `You have successfully registered your Email ${superAdmin.email} with Digi-Mart as SuperAdmin.
        <br><br>We Hope you work hard with dedication.`
        notification.sendNotificationMail(superAdmin.email,subject,message,superAdmin.name)
        res.status(201).json({
            message:`${superAdmin.name} has been registered successfully as SuperAdmin!`,
            data:{
                superAdmin: superAdmin,
                token: token
            }
        })

    }
    catch(err){
        err.status = 404
        next(err)
    }
}

const editOtherSuperAdminProfile = async(req, res, next) => {
    try{
            if(!req.user.role == "owner" || !req.user.role == "Owner"){
                throw new Error(' Sorry! you are Not authorized as owner')
            }
            const superAdminID = req.params.id
            const superAdmin = await SuperAdmin.findOne({_id: superAdminID})
            const updates=Object.keys(req.body)
            updates.forEach((update) => {
                superAdmin[update]=req.body[update]
            })
            await superAdmin.save()
            return res.status(200).json({
                message:`updated`,
                data:{
                    superAdmin
                }
            })

    }
    catch(e){
        e.status = 401
        next(e)
    }
}

const blockOtherSuperAdmin = async(req, res, next) => {
    try{
        if(!req.user.role == "owner" || !req.user.role == "Owner"){
            throw new Error(' Sorry! you are Not authorized as owner')
        }
        const superAdminID = req.params.id
        const superAdmin = await SuperAdmin.findOne({_id: superAdminID})
        superAdmin['isAccountBlock'] = true
        await superAdmin.save()
        return res.status(200).json({
            message:`Blocked`,
            data:{
                superAdmin
            }
        })

    }
    catch(e){
        e.status = 401
        next(e)
    }
}

const unBlockOtherSuperAdmin = async(req, res, next) => {
    try{
        if(!req.user.role == "owner" || !req.user.role == "Owner"){
            throw new Error(' Sorry! you are Not authorized as owner')
        }
        const superAdminID = req.params.id
        const superAdmin = await SuperAdmin.findOne({_id: superAdminID})
        superAdmin['isAccountBlock'] = false
        await superAdmin.save()
        return res.status(200).json({
            message:`UnBlocked`,
            data:{
                superAdmin
            }
        })

    }
    catch(e){
        e.status = 401
        next(e)
    }
}

const getAllSuperAdmins = async(req, res, next) => {
    try{
        const superAdmins = await SuperAdmin.find({})
        return res.status(200).json({
            message:`Fetched SuperAdmins`,
            data:{
                superAdmins
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const viewSuperAdminById = async(req, res, next) => {
    try{
        const superAdmin = await SuperAdmin.find({_id: req.params.id})
        return res.status(200).json({
            message:`Fetched SuperAdmin`,
            data:{
                superAdmin
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getTotalNumberOfSuperAdmins = async(req, res, next) => {
    try{

        const superAdmins = await SuperAdmin.countDocuments({})
        res.status(200).json({
            message:`Fetched total SuperAdmins !`,
            data:{
                count: superAdmins
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}


module.exports = {
    //for superAdmin's own profile
    getMyDetails,
    loginSuperAdmin,
    logoutSuperAdmin,
    deActivateMyAccount,
    activateMyAccount,
    deleteMyAccount,
    updateProfile,
    changePassword,
    //for superAdmin to acess other superAdmins
    getAllSuperAdmins,
    viewSuperAdminById,
    getTotalNumberOfSuperAdmins,
    //for owner only
    registerSuperAdmin,
    editOtherSuperAdminProfile,
    blockOtherSuperAdmin,
    unBlockOtherSuperAdmin,

}