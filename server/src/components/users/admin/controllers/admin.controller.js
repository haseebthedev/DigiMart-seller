const Admin = require('../models/admin.model')
const notification = require('../../../notifications/account')

const registerAdmin = async(req, res, next) => {
    const admin = new Admin(req.body)
    try{
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
        notification.sendRegistrationMail(admin.email,subject,message,admin.name)
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
        const token=await admin.generateAuthToken()
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
//to decativate admin's own profile
const deActivateMyAccount = async(req, res, next) => {
    try{
        //deactivate account status
        req.user.isAccountActive = false;
        req.user.tokens=req.user.tokens.filter((tokens)=>{
            return tokens.token !== req.token
        })
        await req.user.save()
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

const updateProfile = async(req, res, next) => {
    try{
        const updates=Object.keys(req.body)
        const allowedUpdated=['name','email','password','gender','phoneNumber','profilePic',
        'isNotificationsEnabled','isDarkModeEnabled']
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


module.exports = {
    registerAdmin,
    getMyDetails,
    loginAdmin,
    logoutAdmin,
    deActivateMyAccount,
    activateMyAccount,
    deleteMyAccount,
    updateProfile
}