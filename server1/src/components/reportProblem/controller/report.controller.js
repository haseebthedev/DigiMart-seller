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

const viewReportedProblemsOfVendor = async(req, res, next) => {
    try{
        const problems = await ReportProblem.find({ "vendorID": { "$ne": null }, "isProblemResolved": false })
        if(problems.length == 0){
            res.status(200).json({
                message:`No problems found !`,
                data:{
                }
            })
        }
        else{
            res.status(200).json({
                message:`Problems fetched !`,
                data:{
                    problems
                }
            })
        }
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewReportedProblemsOfAdmin = async(req, res, next) => {
    try{
        const problems = await ReportProblem.find({ "adminID": { "$ne": null }, "isProblemResolved": false  })
        if(problems.length == 0){
            res.status(200).json({
                message:`No problems found !`,
                data:{
                }
            })
        }
        else{
            res.status(200).json({
                message:`Problems fetched !`,
                data:{
                    problems
                }
            })
        }
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewReportedProblemsOfBuyer = async(req, res, next) => {
    try{
        const problems = await ReportProblem.find({ "buyerID": { "$ne": null }, "isProblemResolved": false })
        if(problems.length == 0){
            res.status(200).json({
                message:`No problems found !`,
                data:{
                }
            })
        }
        else{
            res.status(200).json({
                message:`Problems fetched !`,
                data:{
                    problems
                }
            })
        }
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const changeProblemStatusById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const problem = await ReportProblem.findById(_id)
        if(!problem){
            throw new Error('No problem Found !')
        }
        else{
            problem.isProblemResolved = true
            await problem.save()
            res.status(200).json({
                message:`Problem status changed !`,
                data:{
                    problem
                }
            })
        }
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}


module.exports = {
    reportVendorProblem,
    reportBuyerProblem,
    reportAdminProblem,
    //FOR ADMIN
    viewReportedProblemsOfVendor,
    viewReportedProblemsOfBuyer,
    changeProblemStatusById,
    //FOR SUPER ADMIN
    viewReportedProblemsOfAdmin
}