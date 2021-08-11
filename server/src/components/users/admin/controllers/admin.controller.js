const Admin = require('../models/admin.model')
const bcrypt=require('bcryptjs')
const notification = require('../../../notifications/account')

//FOR ADMIN's OWN PROFILE
const registerAdmin = async(req, res, next) => {

    try{
        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
        const admin = new Admin(req.body)
        await admin.save()
        const token = await admin.generateAuthToken()

        //send registration mail
        var adminRoles = ""
        admin.roles.forEach((element,index) => {
            adminRoles =  element+", " +adminRoles
        });
        const subject = 'Digi-Mart Admin Registration Email'
        const message = `You have successfully registered your Email ${admin.email} with Digi-Mart as Admin with following roles and authority.
        <br>Authority:<strong> ${admin.authority} Data</strong>
        <br>Roles:<strong> ${adminRoles}</strong>
        <br><br>We Hope you work hard with dedication.`
        notification.sendNotificationMail(admin.email,subject,message,admin.name)
        res.status(201).json({
            message:`${admin.name} has been registered successfully as Admin!`,
            data:{
                admin: admin,
                token: token
            }
        })

    }
    catch(err){
        err.status = 404
        next(err)
    }
}

const getMyDetails = async(req, res, next) => {
    try{
        const adminID = req.user._id
        const admin = await Admin.find({_id:adminID})
        res.status(201).json({
            message: `Admin's data fetched Successfully!`,
            admin: admin
        })
    }
    catch(err){
        err.status = 404
        next(err)
    }
}

const loginAdmin = async(req, res, next) => {
    try{
        const admin=await Admin.findByCredientials(req.body.email,req.body.password)
        if(admin.isAccountBlock){
            throw new Error('Sorry! Your account is Blocked')
        }
        const token=await admin.generateAuthToken()
        admin['isAccountActive'] = true
        res.json({
            message:`You are logged in successfully. Welcome to Admin Dashboard!.`,
            data:{
                admin: admin,
                token:token
            }
        })
    }
    catch(e){
            e.status = 404
            next(e)
    }
}

const logoutAdmin = async(req, res, next) => {
    try{
        const admin = req.user
        // it remove the token of device from which u logged in
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            //if tokens.token !== req.token it returns false filtering it out
            return tokens.token !== req.token
        })
        admin['isAccountActive'] = false
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
//to decativate admin's own profile
const deActivateMyAccount = async(req, res, next) => {
    try{
        const admin = req.user
        //deactivate account status
        req.user.isAccountActive = false;
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            return tokens.token !== req.token
        })
        await req.user.save()

        //send deactivation mail
        const subject = 'Account Deactivation Email'
        const message = `Your account registered on ${admin.email} has been deactivated temporily. 
        You can activate your account anytime by logging in from your credentials. ${admin.name} we hope you have a good day.
        <br><strong>Thank you for your time.</strong>`
        notification.sendNotificationMail(admin.email,subject,message,admin.name)

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

//to activate admin's own profile
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
        const admin = req.user
        await req.user.remove()

        //send deletion mail
        const subject = 'Account Deletion Email'
        const message = `Your account registered on ${admin.email} has been removed from Digi-Mart. 
        Hope you will have a good day.
        <br><strong>Thank you for your time.</strong>`
        notification.sendNotificationMail(admin.email,subject,message,admin.name)        

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

//FOR SUPER ADMIN

const editOtherAdminProfile = async(req, res, next) => {
    try{

        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
            const adminID = req.params.id
            const admin = await Admin.findOne({_id: adminID})
            const updates=Object.keys(req.body)

            // if(updates.length == 0)
            // throw new Error('Invalid Keys! Please enter valid keys.')

            // const allowedUpdated=['name','email','password','gender','phoneNumber',
            // 'accountNumber','routingNumber','bankHolderName','bankName','CNIC', 'roles',
            // 'profilePic','isNotificationsEnabled','isDarkModeEnabled','isAccountActive','isAccountBlock']
            // const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
            // if(!isValidOperation || updates.length == 0){
            //     throw new Error('Invalid Keys! Please enter valid keys.')
            // }

            const updatedRoles = req.body.roles
            //check if role is updated
            if(updatedRoles){
                let isRoleAlreadyPresent = false
                updatedRoles.forEach((updatedRole) => {
                    isRoleAlreadyPresent = false
                    admin.roles.forEach((role) => {
                        if(role == updatedRole){
                            isRoleAlreadyPresent = true
                        }
                    })
                    if(!isRoleAlreadyPresent){
                        admin.roles.push(updatedRole)
                    }
                })
            }
            //update admin
            updates.forEach((update) => {
                if(update !== 'roles')
                admin[update]=req.body[update]
            })
            await admin.save()
            return res.status(200).json({
                message:`updated`,
                data:{
                    admin
                }
            })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const blockOtherAdmin = async(req, res, next) => {
    try{
        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
        const adminID = req.params.id
        const admin = await Admin.findOne({_id: adminID})
        admin['isAccountBlock'] = true
        await admin.save()
        return res.status(200).json({
            message:`Blocked`,
            data:{
                admin
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const unBlockOtherAdmin = async(req, res, next) => {
    try{
        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
        const adminID = req.params.id
        const admin = await Admin.findOne({_id: adminID})
        admin['isAccountBlock'] = false
        await admin.save()
        return res.status(200).json({
            message:`UnBlocked`,
            data:{
                admin
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getAllAdmins = async(req, res, next) => {
    try{
        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
        const admins = await Admin.find({})
        return res.status(200).json({
            message:`Fetched Admins`,
            data:{
                admins
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const viewAdminById = async(req, res, next) => {
    try{
        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
        const admin = await Admin.find({_id: req.params.id})
        return res.status(200).json({
            message:`Fetched Admin`,
            data:{
                admin
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getTotalNumberOfAdmins = async(req, res, next) => {
    try{
        console.log(req.user)
        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
        const admins = await Admin.count({})
        res.status(200).json({
            message:`Fetched total Admins !`,
            data:{
                count: admins
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

const getAdminDetailsByRole = async(req, res, next) => {
    try{
        if(!req.user.roles.includes('Super Admin')){
            throw new Error('Not authorized as a super Admin!')
        }
        const role = req.params.role
        const admins = await Admin.find({roles: { $all: [role] }})
        if(!admins){
            throw new Error('No admin found on this role !')
        }
        res.status(200).json({
            message:`Fetched Admins !`,
            data:{
                admins
            }
        })

    }
    catch(e){
        e.status = 404
        next(e)
    }
}

module.exports = {
    //for admin's own profile
    getMyDetails,
    loginAdmin,
    logoutAdmin,
    deActivateMyAccount,
    activateMyAccount,
    deleteMyAccount,
    updateProfile,
    changePassword,
    //for super admin to acess other admins
    registerAdmin,
    editOtherAdminProfile,
    blockOtherAdmin,
    unBlockOtherAdmin,
    getAllAdmins,
    viewAdminById,
    getTotalNumberOfAdmins,
    getAdminDetailsByRole

}