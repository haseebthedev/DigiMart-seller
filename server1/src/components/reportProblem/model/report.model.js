const mongoose=require('mongoose')
const validator=require('validator')

const reportProblemSchema = mongoose.Schema({
    buyerID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Buyer'
    },
    sellerID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Seller'
    },
    adminID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Admin'
    },
    email:{
        type: String,
        required: true
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
reportProblemSchema.statics.getStorageDetails = async function() {
    const Size = await ReportProblem.collection.stats({scale: 1024});
    return Size.totalSize
}

const ReportProblem = mongoose.model('ReportProblem',reportProblemSchema)
module.exports = ReportProblem