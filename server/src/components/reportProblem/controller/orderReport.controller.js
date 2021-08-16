const OrderProblemReport = require('../model/orderReport.model')
const notification = require('../../notifications/account');
const Seller = require('../../users/seller/models/seller.model')

const reportOrderProblem = async(req, res, next) => {
    try{
        const storeID = req.body.storeID
        req.body.email = req.user.eamil
        req.body.buyerID = req.user._id
        const orderProblem = new OrderProblemReport(req.body)
        await orderProblem.save()
        const seller = await Seller.findOne({storeId: storeID})

        //send mail
        const subject = 'Order Problem Reported'
        const message = `Customer reported a problem in order delivered, with following problem statement and description.
        <br><strong>${orderProblem.subject}</strong><br>${orderProblem.description}
        <br><strong>Buyer ID: </strong>${orderProblem.buyerID}
        <br><strong>Problem ID: </strong>${orderProblem._id}
        <br>Order complaints notifications from <strong>Digi-Mart</strong>`
        
        notification.sendNotificationMail(seller.email,subject,message,seller.name)

       res.status(201).json({
           message:`Problem sent!`,
           data:{
               problem: orderProblem
           }
       })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}