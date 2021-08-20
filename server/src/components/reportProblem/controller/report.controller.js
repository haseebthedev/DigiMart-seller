const ReportProblem = require('../model/report.model')
const notification = require('../../notifications/account');
const SOFTWARE_MENTAINENECE_EMAIL = 'digimart.cui@gmail.com'

const reportSellerProblem = async(req, res, next) => {
    try{
        req.body.email = req.user.eamil
        req.body.sellerID = req.user._id
        const myProblem = new ReportProblem(req.body)
        await myProblem.save()

        //send mail
        const subject = 'Seller Problem Reported'
        const message = `Our seller reported a problem with following problem statement and description.
        <br><strong>${myProblem.subject}</strong><br>${myProblem.description}
        <br><strong>Seller ID: </strong>${myProblem.sellerID}
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

const reportSuperAdminProblem = async(req, res, next) => {
    try{
        req.body.email = req.user.eamil
        req.body.adminID = req.user._id
        const myProblem = new ReportProblem(req.body)
        await myProblem.save()

        //send mail
        const subject = req.body.subject
        const message = `${req.body.description}
        <br>System complaints notifications from <strong>Digi-Mart</strong>`
        
        notification.sendNotificationMail(SOFTWARE_MENTAINENECE_EMAIL,subject,message,'')

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

const viewReportedProblemsOfSeller = async(req, res, next) => {
    try{
        const problems = await ReportProblem.find({ "sellerID": { "$ne": null }, "isProblemResolved": false })
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

const viewReportedProblemsOfSuperAdmin = async(req, res, next) => {
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
    reportSellerProblem,
    reportBuyerProblem,
    reportSuperAdminProblem,
    //FOR ADMIN
    viewReportedProblemsOfSeller,
    viewReportedProblemsOfBuyer,
    changeProblemStatusById,
    //FOR SUPER ADMIN
    viewReportedProblemsOfSuperAdmin
}