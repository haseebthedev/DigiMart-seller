const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');

const orderSchema = new mongoose.Schema({
    productsId:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Product',
        required: true
    },
    buyerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Buyer',
        required: true
    },
    deliveryAddress:{
        type: String,
        required: true
    },
    contactNumber:{
        type: String
    },
    status:{
        type: String
    },
    couponCode:{
        type: String
    },
    discount:{
        type: Number
    },
    orderDate:{
        
    }

})