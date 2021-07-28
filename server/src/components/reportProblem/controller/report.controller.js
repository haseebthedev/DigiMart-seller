const ReportProblem = require('../model/report.model')
const notification = require('../../notifications/account');

const reportVendorProblem = async(req, res, next) => {
    try{
        req.body.email = req.user.eamil
        req.body.vendorID = req.user._id
        const myProblem = new ReportProblem(req.body)
        await myProblem.save()

        //send mail
        const subject = 'Seller Problem Reported'
        const message = `Our seller reported a problem with following problem statement and description.
        <br><strong>${myProblem.subject}</strong><br>${myProblem.description}
        <br><strong>Vendor ID: </strong>${myProblem.vendorID}
        <br><strong>Problem ID: </strong>${myProblem._id}`
        notification.sendReportProblemMail(subject,message,'Complaints Department')

        res.status(201).json({
            message:`Problem sent!`,
            data:{
                problem: myProblem
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const reportBuyerProblem = async(req, res, next) => {
    try{
        req.body.email = req.user.eamil
        req.body.buyerID = req.user._id
        const myProblem = new ReportProblem(req.body)
        await myProblem.save()

         //send mail
         const subject = 'Buyer Problem Reported'
         const message = `Our buyer reported a problem with following problem statement and description.
         <br><strong>${myProblem.subject}</strong><br>${myProblem.description}
         <br><strong>Buyer ID: </strong>${myProblem.buyerID}
         <br><strong>Problem ID: </strong>${myProblem._id}`
         notification.sendReportProblemMail(subject,message,'Complaints Department')

        res.status(201).json({
            message:`Problem sent!`,
            data:{
                problem: myProblem
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const reportAdminProblem = async(req, res, next) => {
    try{
        req.body.email = req.user.eamil
        req.body.adminID = req.user._id
        const myProblem = new ReportProblem(req.body)
        await myProblem.save()

         //send mail
         const subject = 'Admin Problem Reported'
         const message = `Our admin reported a problem with following problem statement and description.
         <br><strong>${myProblem.subject}</strong><br>${myProblem.description}
         <br><strong>Admin ID: </strong>${myProblem.adminID}
         <br><strong>Problem ID: </strong>${myProblem._id}`
         notification.sendReportProblemMail(subject,message,'Complaints Department')

        res.status(201).json({
            message:`Problem sent!`,
            data:{
                problem: myProblem
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

module.exports = {
    reportVendorProblem,
    reportBuyerProblem,
    reportAdminProblem
}