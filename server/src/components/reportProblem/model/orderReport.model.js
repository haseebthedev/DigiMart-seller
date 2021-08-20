const mongoose=require('mongoose')
const validator=require('validator')

const orderReportProblemSchema = mongoose.Schema({
    buyerID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Buyer'
    },
    storeID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Store'
    },
    orderID:{
        type: String,
        required: true,
        //ref:'Order'
    },
    storeName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
    },
    subject:{
        type: String,
        required: [true,'Enter Subject of problem']
    },
    description:{
        type: String,
        required: [true, 'Enter complete decsription of problem']
    },
    screenShot:{
        type: String
    },
    isProblemResolved:{
        type: Boolean,
        default: false
    }},
    {
        //to create track of when user was created or updated
        timestamps: true
    })

//get Size of collection
orderReportProblemSchema.statics.getStorageDetails = async function() {
    const Size = await orderReportProblemSchema.collection.stats({scale: 1024});
    return Size.totalSize
}

const OrderProblemReport = mongoose.model('OrderProblemReport',orderReportProblemSchema)
module.exports = OrderProblemReport