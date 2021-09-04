const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const crypto = require('crypto')
var uniqueValidator = require('mongoose-unique-validator');
const SALT_WORK_FACTOR = 8

const sellerSchema=new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please enter your name in name field!'],
        trim:true,
        validate(str){
            if(!validator.isByteLength(str,{min:3,max:30})){
                throw new Error('Name must be between 3 to 30 characters long!');
            }
        }
    },
    email:{
        type:String,
        required:[true,'Please enter email!'],
        trim:true,
        unique:[true,'User already registered with this Email !'],
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                 throw new Error("Please enter valid email!")
            }
        }
    },
    phoneNumber:{
        type: String,
        required: [true,'Please enter phone number !'],
        unique: [true,'User already registered with this phone number!'],
        validate(str){
            var regExpNumber = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
            if(!str.match(regExpNumber)){
                throw new Error('Please enter valid phone number!')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password'))
            throw new Error('Password cannot be "password"!')
        }
    },
    //Payment account details
    PaymentAccounts:[{
        accountNumber:{
            type:String,
            // validate(value){
            //     if(!validator.isIBAN(value)){
            //          throw new Error("Account Number is invalid!")
            //     }
            // }
        },
        routingNumber:{
            type: String
        },
        AccountHolderName:{
            type: String
        },
        bankName:{
            type: String
        },
        paymentMethod:{
            type: String
        },
        isPrimaryAccount:{
            type: Boolean
        },
        paymentEmail:{
            type: String
        }
    }],
    CNIC:{
        type:String,
        required:[true,'Please enter your valid CNIC number!'],
        unique: [true,'User already registered with this CNIC!'],
        validate(str){
            var regExpCNIC = /\d{5}-\d{7}-\d/;
            if(!str.match(regExpCNIC)){
                throw new Error('Please enter CNIC in correct format e.g. 12345-1234567-1')
            }
        }
    },
    storeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Store'
    },
    isStoreRegistered:{
        type:Boolean,
        default:false
    },
    // storeID:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Store',
    // },
    profilePic:{
        type: String
    },
    status:{
        type: String,
        default: "Pending",
        enum: ["Active", "Pending", "Blocked", "Deactivate"]
    },
    city:{
        type: String
    },
    address:{
        type: String
    },
    isNotificationsEnabled:{
        type: Boolean,
        default: true
    },
    isDarkModeEnabled:{
        type:Boolean,
        default:false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    
},
{
    //to create track of when user was created or updated
    timestamps: true
})

//crating index on email
// sellerSchema.index({email: 1},{unique: true, name:'IDX_EMAIL'})

 //finding seller from email and pass 
sellerSchema.statics.findByCredientials= async(email,password)=>{
    const user=await Seller.findOne({email})

    if(!user && !password && !email){
        throw new Error('Unable to login! Please enter valid email and password! ')
    }
    if(!user){
        throw new Error('Unable to login! Invalid email !')
    }
    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
      throw new Error('Unable to login! Invalid password!')
    }
    return user
}

//get Size of collection
sellerSchema.statics.getStorageDetails = async function() {
    const sellerSize = await Seller.collection.stats({scale: 1024});
    return sellerSize.totalSize
}

//when we call res.send() its calling json.stringify() behind the scenes
//whenever the object gets stringify toJSON() is called so we use it here to hide data
sellerSchema.methods.toJSON=function(){
    const user=this
    //get our raw object with user data attached
    //it will remove all the stuff mongoose has on it to perform operations
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.accountNumber
    delete userObject.routingNumber
    delete userObject.bankHolderName
    delete userObject.bankName
    //delete userObject.CNIC
    //we delete img to display to user bcz it takes much time to fetch binary data of img
    //delete userObject.profilePic
    return userObject

}

//generate authentication token
sellerSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SELLER_CODE,{
        expiresIn: process.env.JWT_SELLER_EXPIRES_IN,
    })
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

sellerSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};


//encrypt password
sellerSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,SALT_WORK_FACTOR) 
    }
    next()
})

sellerSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
//creating model of moongoose and then creating an instance of model and then saving it
const Seller = mongoose.model('Seller',sellerSchema)
module.exports = Seller