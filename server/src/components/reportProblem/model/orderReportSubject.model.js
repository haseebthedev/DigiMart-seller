const mongoose=require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const orderReportSubjectSchema = new mongoose.Schema({
    name:{
        type: String,
        unique:[true,'Subject already present with this name!'],
        required: true
    },
    description:{
        type: String,
        //required: [true,'Please enter category description']
    }
})

orderReportSubjectSchema.statics.getStorageDetails = async function() {
    const Size = await OrderReportSubject.collection.stats({scale: 1024});
    return Size.totalSize
}

orderReportSubjectSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
//creating model of moongoose and then creating an instance of model and then saving it
const OrderReportSubject = mongoose.model('OrderReportSubject',orderReportSubjectSchema)
module.exports = OrderReportSubject