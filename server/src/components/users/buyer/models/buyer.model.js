const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
var uniqueValidator = require('mongoose-unique-validator');
const SALT_WORK_FACTOR = 8

const buyerSchema=new mongoose.Schema({
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
    gender:{
        type:String,
        required:[true,'select your gender!'],
        enum: ['male','female','other']
    },
    birthday:{
        type:String,
        required:[true,'select your birthday!'],
        validate(DOB){
            var regexDOB = /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/;
            if(!DOB.match(regexDOB))
            throw new Error('Please enter date in correct format e.g 1/12/2021')

            if(DOB.match(regexDOB)){
                var parts = DOB.split("/");
                var dtDOB = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
                var dtCurrent = new Date();
                if (dtCurrent.getFullYear() - dtDOB.getFullYear() < 10) {
                    throw new Error('Age be at least 10 years to register!')
                }
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
    accountNumber:{
        type:String,
        validate(value){
            if(!validator.isIBAN(value)){
                 throw new Error("Account Number is invalid!")
            }
        }
    },
    isAccountActive:{
        type:Boolean
    },
    isAccountBlocked:{
        type: Boolean,
        default: false
    },
    subscribedStores:[{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Store'
    }],
    profilePic:{
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
    //i commented it to use later when its schemas are created
    // orders:{
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref:'Order'
    // },
    // reviews:{
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref:'Review'
    // },

    // we use tokens array bcz we can login from different devices so we need different token for each device
    // so if we logout from one we can from from the other session
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

//crating ondex on email
// buyerSchema.index({email: 1},{unique: true, name:'IDX_EMAIL'})

 //finding buyer from email and pass 
buyerSchema.statics.findByCredientials= async(email,password)=>{
    const user=await Buyer.findOne({email})

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
buyerSchema.statics.getStorageDetails = async function() {
    const Size = await Buyer.collection.stats({scale: 1024});
    return Size.totalSize
}

//when we call res.send() its calling json.stringify() behind the scenes
//whenever the object gets stringify toJSON() is called so we use it here to hide data
buyerSchema.methods.toJSON=function(){
    const user=this
    //get our raw object with user data attached
    //it will remove all the stuff mongoose has on it to perform operations
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    //we delete img to display to user bcz it takes much time to fetch binary data of img
    //delete userObject.profilePic
    return userObject
}

//for methods on the instance and individual user 
buyerSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_BUYER_CODE,{
        expiresIn: process.env.JWT_BUYER_EXPIRES_IN,
    })
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

//we are using middleware property of mongoose to check the data before saving
// we have to use simple function bcz arrow functions dont do binding
buyerSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,SALT_WORK_FACTOR) 
    }
    //next makes the pre to go on next stage i.e save the model else it will stop here
    next()
})

buyerSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
//creating model of moongoose and then creating an instance of model and then saving it
const Buyer = mongoose.model('Buyer',buyerSchema)
module.exports = Buyer