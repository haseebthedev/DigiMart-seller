const PromoteProduct = require('../model/promoteProduct.model')
const PromotionAudience = require('../model/promotionAudience.model')
const Order = require('../../orders/model/order.model')
const Buyer = require('../../users/buyer/models/buyer.model')
const Store = require('../../store/model/store.model')
const notification = require('../../notifications/account');
const validUrl = require('valid-url')
const shortid = require('shortid')
const sendSMS = require('../sendSMS')


const addPromotedProduct = async(req, res, next) => {
    try{
        let storeId = ""
        let store = ""
        //for store
        if(!req.store){
            storeId = req.params.id
        }
        else{
            storeId = req.store._id
            store = await Store.find({_id: storeId})
        }
        //if promotion tool is not approved
        if(store.isApprovedPromotionTool == false){
            throw new Error('Sorry! You cannot promote your products. Contact admin to activate your promotoion tool!')
        }
        const messageBody = req.body.message
        ///////check if promote to promotion Audience
        const promotionAudienceId = req.body.promotedAudienceId
        if(promotionAudienceId){
            const promotionAudience = await PromotionAudience.findById(promotionAudienceId)
            //IF PROMOTION SOURCE IS SMS
            if(promotionAudience.promotionSource == "sms"){
                promotionAudience.promotionData.forEach((promotee) => {
                    //console.log(promotee.number)
                    sendSMS.message(promotee.number , messageBody)
                })
            }
            //IF PROMOTION SOURCE IS EMAIL
            if(promotionAudience.promotionSource == "email"){
                promotionAudience.promotionData.forEach((promotee) => {
                    //console.log(promotee.number)
                    const subject = 'Digi-Mart Promotion Alert !'
                    notification.sendNotificationMail(promotee.email,subject,messageBody,promotee.name)
                })
            }
        }

        ///////check if promote to imported contacts i.e sent through array
        const audienceNumbers = req.body.audienceNumbers
        if(audienceNumbers){
            audienceNumbers.forEach(async (number) => {
                    //console.log(number)
                    await sendSMS.message(number , messageBody)
            })
        }

        ///////check if promote to imported emails i.e sent through array
        const audienceEmails = req.body.audienceEmails
        if(audienceEmails){
            audienceEmails.forEach((email) => {
                    //console.log(number)
                    const subject = 'Digi-Mart Promotion Alert !'
                    notification.sendNotificationMail(email,subject,messageBody,'Respected Sir/Madam')
            })
        }

        //////check if promote to buyers of store
        const buyerPromotionSource = req.body.buyerPromotionSource
        const isPromoteToBuyers = req.body.isPromoteToBuyers
        if(isPromoteToBuyers){

            let storeBuyersIds = await Order.find({storeId: storeId},{
                "_id": 0,
                "buyerId": 1
              })
            storeBuyersIds = storeBuyersIds.map(function (element) {
                return element.buyerId;
              });  

            //IF PROMOTION SOURCE IS SMS
            if(buyerPromotionSource == "sms"){            
                const storeBuyers = await Buyer.find({ '_id': { $in: storeBuyersIds } } ,{
                    "_id": 0,
                    "phoneNumber": 1
                  })
                storeBuyers.forEach((buyer) => {
                    //console.log('num'+buyer.phoneNumber)
                    sendSMS.message(buyer.phoneNumber , messageBody)
                })
            }

            //IF PROMOTION SOURCE IS EMAIL            
            const storeBuyers = await Buyer.find({ '_id': { $in: storeBuyersIds } } ,{
                "_id": 0,
                "email": 1
              })
            storeBuyers.forEach((buyer) => {
                //console.log('num'+buyer.phoneNumber)
                const subject = 'Digi-Mart Promotion Alert !'
                notification.sendNotificationMail(buyer.email,subject,messageBody,'Respected Sir/Madam')
            })
            
        }
        //for scheduled promotions
        let scheduleMessage = ""
        if(req.body.promotion_date){
            req.body.promotion_date = (new Date(Date.parse(req.body.promotion_date+' GMT'))).toISOString()
            scheduleMessage = 'On following date and time '+ req.body.promotion_date
        }
        req.body['storeId'] = storeId
        const product = new PromoteProduct(req.body)
        await product.save()
        res.status(201).json({
            message:`Promoted product has been added successfully ${scheduleMessage}!`,
            data:{
                product: product
            }
        })
    }
    catch (err){
        err.status = 500
        next(err)
    }
}

const checkIfProductPromotedBefore = async(req, res, next) => {
    try{
        const REQUIRED_DAYS_DIFFERENCE = 7
        const productId = req.params.productId
        const isProductPresent = await PromoteProduct.findOne({productId})
        //if product not prsent in promoted product DB then send response OK
        //console.log(isProductPresent)
        if(!isProductPresent){
            res.status(200).json({
                    message:`Product Valid For Promotion.`,
                    data:{
                        isProductValidForPromotion: true
                    }
                })
        }
        else{
            //check if product was promoted a week ago,
            //if yes start promotion again else show error message 
            var todayDate = new Date()
            var productPromotionDate = isProductPresent['promotion_date']
            //console.log(isProductPresent, productPromotionDate)
            //productPromotionDate = productPromotionDate.split("T")[0];
            var Difference_In_Time = todayDate.getTime() - productPromotionDate.getTime();
            var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
            if(Difference_In_Days < REQUIRED_DAYS_DIFFERENCE){
                res.status(200).json({
                    message:'Sorry! you promoted this product less than ' +REQUIRED_DAYS_DIFFERENCE+ ' days ago !',
                    data:{
                        isProductValidForPromotion: false
                    }
                })
            }
            else{
                res.status(200).json({
                    message:`Product Valid For Promotion.`,
                    data:{
                        isProductValidForPromotion: true
                    }
                })
            }
        
        }
        
    }
    catch (err){
        err.status = 404
        next(err)
    }
}


const editScheduledPromotionById = async(req, res, next) => {
    try{
        const updates=Object.keys(req.body)
        const _id = req.params.id
        const promotion = await PromoteProduct.findOne({_id:_id})
        // console.log('p',promotion)
        if(!promotion){
            throw new Error('Scheduled Product Promotion not found !')
        }
        if(req.body.promotion_date){
            req.body.promotion_date = (new Date(Date.parse(req.body.promotion_date+' GMT'))).toISOString()
        }
        //console.log('p',req.body.promotion_date)
        updates.forEach((update) => promotion[update] = req.body[update])
        
        await promotion.save()
        res.status(200).json({
            message:`Product promotion schedule updated successfully!`,
            data:{
                promotion
            }
        })

    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const deleteScheduledPromotionById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const promotion = await PromoteProduct.findOneAndDelete({_id: _id})
        if(promotion.length == 0){
            throw new Error('Scheduled Product Promotion not found !')
        }
        res.status(200).json({
            message:`Product promotion deleted successfully!`,
            data:{
                promotion
            }
        })

    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const viewScheduledPromotionById = async(req, res, next) => {
    try{
        const _id = req.params.id
        const promotion = await PromoteProduct.find({_id: _id})
        if(promotion.length == 0){
            throw new Error('Scheduled Product Promotion not found !')
        }
        res.status(200).json({
            message:`Product promotion fetched successfully!`,
            data:{
                promotion
            }
        })

    }
    catch (err){
        err.status = 404
        next(err)
    }
}


const getScheduledPromotionsOfStore = async(req, res, next) => {
    try{
        const promotions = await PromoteProduct.find({isPromotionScheduled: true, storeId: req.store._id})
        res.status(201).json({
            message:`Promotions fetched successfully!`,
            data:{
                promotions
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getPromotedProductsOfStore = async(req, res, next) => {
    try{
        const productPromotions = await PromoteProduct.find({isPromotionScheduled: false, storeId: req.store._id})
        res.status(201).json({
            message:`Product Promotions fetched successfully!`,
            data:{
                productPromotions
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const getAllPromotedProducts = async(req, res, next) => {
    try{
        const productPromotions = await PromoteProduct.find({isPromotionScheduled: false})
        res.status(201).json({
            message:`Promoted products fetched successfully!`,
            data:{
                productPromotions
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const generateShortURL = async(req, res, next) => {
    try{
        const {
            longUrl
        } = req.body
        const baseUrl = process.env.BASE_URL
        // check base url if valid using the validUrl.isUri method
        if (!validUrl.isUri(baseUrl)) {
            throw new Error('Invalid base URL')
        }
        if (!validUrl.isUri(longUrl)) {
            throw new Error('Invalid longUrl')
        }
        //we check if URL is already present in DB
        let url = await PromoteProduct.findOne({
            longUrl
        })
        if (url) {
            res.status(200).json({
                message:`short URL already created!`,
                data:{
                    shortUrl: url.shortUrl,
                    isUrlAlreadyCreated: true
                }
            })
        }
        else{
            // if valid, we create the url code
            const urlCode = shortid.generate()
            // join the generated short code the the base url
            const shortUrl = baseUrl + '/' + urlCode
            res.status(201).json({
                message:`URL created successfully!`,
                data:{
                    longUrl,
                    shortUrl,
                    urlCode,
                    isUrlAlreadyCreated: false
                }
            })
        }

    }
    catch (err){
        err.status = 404
        next(err)
    }
}

const redirectToLongUrl = async(req, res, next) => {
    try {
        // find a document match to the code in req.params.code
        const url = await PromoteProduct.findOne({
            urlCode: req.params.code
        })
        if (url) {
            // when valid we perform a redirect
            return res.redirect(url.longUrl)
        } else {
            // else return a not found 404 status
            return res.status(404).json('No URL Found !')
        }

    }
    // exception handler
    catch (err) {
        err.status = 404
        next(err)
    }
}

const sendPromotionMessage = async(req, res, next) => {
    try{
        messageBody = req.body.message
        recieverNumber = req.body.number
        sendSMS.message(recieverNumber , messageBody)
            res.status(200).json({
                message:`Message sent !`,
                data:{
                    recieverNumber,
                    messageBody,
                    //sentSMSId
                }
            })
    }
    catch (err) {
        err.status = 404
        next(err)
    }
}

const sendPromotionMessageToAudience = async(req, res, next) => {
    try{
        const messageBody = req.body.message
        const audienceNumbers = req.body.audienceNumbers
        audienceNumbers.forEach(async (number) => {
            //console.log(number)
            await sendSMS.message(number , messageBody)
        })
        res.status(200).json({
            message:`Message sent To Audience Successfully!`,
            data:{
                messageBody,
                audienceNumbers
            }
        })
    }
    catch (err) {
        err.status = 404
        next(err)
    }
}


//FOR ADMIN


const getScheduledPromotionsOfStoreByStoreId = async(req, res, next) => {
    try{
        const promotions = await PromoteProduct.find({isPromotionScheduled: true, storeId: req.params.id})
        res.status(201).json({
            message:`Promotions fetched successfully!`,
            data:{
                promotions
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}


const getPromotedProductsOfStoreByStoreId = async(req, res, next) => {
    try{
        const productPromotions = await PromoteProduct.find({isPromotionScheduled: false, storeId: req.params.id})
        res.status(201).json({
            message:`Product Promotions fetched successfully!`,
            data:{
                productPromotions
            }
        })
    }
    catch (err){
        err.status = 404
        next(err)
    }
}



module.exports = {
    //FOR VENDOR
    addPromotedProduct,
    checkIfProductPromotedBefore,
    getScheduledPromotionsOfStore,
    getPromotedProductsOfStore,
    generateShortURL,
    redirectToLongUrl,
    editScheduledPromotionById,
    deleteScheduledPromotionById,
    viewScheduledPromotionById,
    sendPromotionMessage,
    sendPromotionMessageToAudience,
    //FOR ADMIN
    getAllPromotedProducts,
    getPromotedProductsOfStoreByStoreId,
    getScheduledPromotionsOfStoreByStoreId

}