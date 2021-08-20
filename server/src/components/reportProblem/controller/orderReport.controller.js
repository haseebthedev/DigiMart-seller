const OrderProblemReport = require('../model/orderReport.model')
const notification = require('../../notifications/account');
const Seller = require('../../users/seller/models/seller.model')
const OrderReportSubject = require('../model/orderReportSubject.model')

//FOR BUYER
const reportOrderProblem = async(req, res, next) => {
    try{
        const storeID = req.body.storeID
        req.body.email = req.user.email
        req.body.buyerID = req.user._id
        const orderProblem = new OrderProblemReport(req.body)
        await orderProblem.save()
        const seller = await Seller.findOne({storeId: storeID})

        //send mail
        const subject = 'Order Problem Reported'
        const message = `Hi ${seller.name}, A customer of your store reported a problem in order delivered, with following problem statement and description.
        <br><strong>${orderProblem.subject}</strong><br>${orderProblem.description}
        <br><strong>Buyer ID: </strong>${orderProblem.buyerID}
        <br><strong>Buyer Email: </strong>${orderProblem.buyerID}
        <br><strong>Problem ID: </strong>${orderProblem._id}
        <br><strong>Order ID: </strong>${orderProblem.orderID}
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

//FOR SELLER

const updateOrderProblemById = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        const _id = req.params.id
        const problem = await OrderProblemReport.findOne({_id})
        updates.forEach((update) => {
            problem[update] = req.body[update]
        })
        await problem.save()

        res.status(200).json({
            message:`Problem Updated!`,
            data:{
                problem
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}


const viewOrderProblemByOrderId = async(req, res, next) => {
    try{
        const _id = req.params.id
        const problem = await OrderProblemReport.find({orderID : _id})
        res.status(200).json({
            message:`Problem fetched!`,
            data:{
                problem
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const deleteOrderProblemById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const problem = await OrderProblemReport.findByIdAndDelete(_id)
        res.status(200).json({
            message:`Problem deleted!`,
            data:{
                problem
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewAllOrdersProblemsOfStoreByID = async(req, res, next) => {
    try{
        let storeId = ""
        if(req.store){
            storeId = req.store._id
        }
        else{
            storeId = req.params.id
        }
        const orderProblems = await OrderProblemReport.find({storeID : storeId})
        res.status(200).json({
            message:`Store orders Problems fteched!`,
            data:{
                orderProblems
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewAllOrderProblemsOfAllStores = async(req, res, next) => {
    try{
        const orderProblems = await OrderProblemReport.find({})
        res.status(200).json({
            message:`Orders Problems fteched!`,
            data:{
                orderProblems
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

//For CRUD ops on subjects of reporting order related problems

const addOrderReportSubject= async(req, res, next) => {
    try{
        const isOrderReportSubjectPresent = await OrderReportSubject.findOne({name: req.body.name})
        if(isOrderReportSubjectPresent){
            res.status(200).json({
                message:`Sorry ! Subject with this name is already present.`,
                data:{
                }
            })
        }
        else{
            const orderReportSubject = new OrderReportSubject(req.body)
            await orderReportSubject.save()
            res.status(200).json({
                message:`Your  orderReportSubject has been added successfully!`,
                data:{
                    orderReportSubject
                }
            })
        }
        
    }
    catch(e){
        e.status = 404
        next(e)
    }
}


const deleteOrderReportSubject = async(req, res, next) => {
    try{
        const _id = req.params.id
        const orderReportSubject = await OrderReportSubject.findOneAndDelete({_id:_id})
        if(!orderReportSubject){
            throw new Error('OrderReportSubject not found!')
        }
        res.status(200).json({
            message:`orderReportSubject has been deleted successfully!`,
            data:{
                orderReportSubject
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const updateOrderReportSubject = async(req, res, next) => {
    try{
        const updates = Object.keys(req.body)
        const orderReportSubjectID = req.params.id
        
        const orderReportSubject = await OrderReportSubject.findOne({_id:orderReportSubjectID})
        updates.forEach((update) => orderReportSubject[update] = req.body[update])
        await orderReportSubject.save()
        res.status(200).json({
            message:`OrderReportSubject has been updated successfully!`,
            data:{
                orderReportSubject
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getOrderReportSubjectById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const orderReportSubject = await OrderReportSubject.find({_id:_id})
        if(orderReportSubject.length == 0){
            throw new Error('OrderReportSubject not found!')
        }
        res.status(200).json({
            message:`OrderReportSubject fetched successfully!`,
            data:{
                orderReportSubject
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllOrderReportSubjects = async(req, res, next) => {
    try{
        const subjects = await OrderReportSubject.find({})
        res.status(200).json({
            message:`Order report subjects fetched successfully!`,
            data:{
                subjects
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}


module.exports = {
    //buyer
    reportOrderProblem,
    //seller and admin
    updateOrderProblemById,
    deleteOrderProblemById,
    viewOrderProblemByOrderId,
    viewAllOrdersProblemsOfStoreByID,
    viewAllOrderProblemsOfAllStores,
    // for order report subjects
    addOrderReportSubject,
    deleteOrderReportSubject,
    updateOrderReportSubject,
    getOrderReportSubjectById,
    getAllOrderReportSubjects
}