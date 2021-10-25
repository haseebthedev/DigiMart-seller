const ReportProblem = require('../model/report.model')
const notification = require('../../notifications/account');
const SOFTWARE_MENTAINENECE_EMAIL = 'sheikh.ameen252@gmail.com@gmail.com'

const reportSellerProblem = async(req, res, next) => {
    try{
        req.body.email = req.user.email
        req.body.sellerID = req.user._id
        const myProblem = new ReportProblem(req.body)
        await myProblem.save()

        //send mail to admin
        const subjectAdmin = 'Seller Problem Reported'
        const messageAdmin = `I am facing following issues while using Digi-Mart.
        <br><strong>Subject: ${myProblem.subject}</strong><br><strong>Description: ${myProblem.description}</strong><br>
        <br><strong>Seller ID: </strong>${myProblem.sellerID}
        <br><strong>Seller name: </strong>${req.user.name}
        <br><strong>Problem ID: </strong>${myProblem._id}`
        notification.sendReportProblemMail(req.user.email,subjectAdmin,messageAdmin,'Respected Admin')

        
        //send mail to buyer
        const subjectSeller = 'Problem Reported Successfully!'
        const messageSeller = `Your problem has been reported successfully. 
        We will try to resolve it as soon as possible.<br> Thank you for your time.
        <br><strong>Subject: ${myProblem.subject}</strong><br><strong>Description: ${myProblem.description}</strong><br>
        `
        notification.sendNotificationMail(req.user.email,subjectSeller,messageSeller,req.user.name)

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
        req.body.email = req.user.email
        req.body.buyerID = req.user._id
        const myProblem = new ReportProblem(req.body)
        //myProblem.email = req.user.eamil
        await myProblem.save()

         //send mail to admin
         const subjectAdmin = 'Buyer Problem Reported'
         const messageAdmin = `I am facing following issues while using Digi-Mart.
         <br><strong>Subject: ${myProblem.subject}</strong><br><strong>Description: ${myProblem.description}</strong><br>
         <br><strong>Buyer ID: </strong>${myProblem.buyerID}
         <br><strong>Buyer name: </strong>${req.user.name}
         <br><strong>Problem ID: </strong>${myProblem._id}`
         notification.sendReportProblemMail(req.user.email, subjectAdmin,messageAdmin,'Respected Admin')

        //send mail to buyer
        const subjectBuyer = 'Problem Reported Successfully!'
        const messageBuyer = `Your problem has been reported successfully. 
        We will try to resolve it as soon as possible. <br> Thank you for your time.
        <br><strong>Subject: ${myProblem.subject}</strong><br><strong>Description: ${myProblem.description}</strong><br>
        `
        notification.sendNotificationMail(req.user.email,subjectBuyer,messageBuyer,req.user.name)

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
        req.body.email = req.user.email
        req.body.adminID = req.user._id
        const myProblem = new ReportProblem(req.body)
        await myProblem.save()

        //send mail
        const subject = 'Digi-Mart Problem Reported'
        const message = `The Admin of Digi-Mart reported a problem with following problem subject and description.
        <br><strong>Subject: ${myProblem.subject}</strong><br><strong>Description: ${myProblem.description}</strong><br>
        `
        
        notification.sendNotificationMail(SOFTWARE_MENTAINENECE_EMAIL,subject,message,'TheAWeb Solutions')

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

            //send mail to buyer
            const subject = 'Problem Resolved'
            const message = `Your order compalint has been resolved successfully!. 
            We will try our best you don't face this problem in future.<br> Thank you for your time.
            <br><strong>Subject: ${problem.subject}</strong><br><strong>Description: ${problem.description}</strong><br>
            `
            notification.sendNotificationMail(problem.email,subject,message,"Respected Digi-Mart User")

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