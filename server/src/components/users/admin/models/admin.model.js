const mongoose=require('mongoose')
const validator=require('validator')
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const SALT_WORK_FACTOR = 8

const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
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
        unique:[true,'Admin already registered with this Email !'],
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                 throw new Error("Please enter valid email!")
            }
        }
    },
    phoneNumber:{
        type: String,
        required: [true,'Please enter phone number!'],
        unique: [true,'Admin already registered with this phone number!'],
        validate(str){
            var regExpNumber = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
            if(!str.match(regExpNumber)){
                throw new Error('Please enter valid phone number!')
            }
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
    profilePic:{
        type: [String]
    },
    isAccountActive: {
        type: Boolean,
        default: true
    },
    isAccountBlock:{
        type:Boolean,
        default:false
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
    //It select roles you want to assign to Admin. i.e only read app data, read-write both, write only
    // authority:{
    //     type:String,
    //     required:[true,'Please select authority you want to assign to Admin.'],
    //     enum:['read-write', 'read', 'write']
    // },
    roles:{
        type: [String],
        required: [true,'Please select roles you want to assign to Admin!']
    },
    isNotificationsEnabled:{
        type: Boolean,
        default: true
    },
    isDarkModeEnabled:{
        type:Boolean,
        default:false
    },
    address:{
        type:String
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    //It contains all the actions that admin has performed i.e approves stores, disapproved stores etc.
    // actions:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'AdminActions'
    // }]
},
{
    //to create track of when user was created or updated
    timestamps: true
})

//crating index on email
adminSchema.index({email: 1},{unique: true, name:'IDX_EMAIL'})

//finding admin from email and pass 
adminSchema.statics.findByCredientials= async(email,password)=>{
    const user=await Admin.findOne({email})

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

//generating authentication token for admin
adminSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_ADMIN_CODE,{
        expiresIn: process.env.JWT_ADMIN_EXPIRES_IN,
    })
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

//get Size of collection
adminSchema.statics.getStorageDetails = async function() {
    const Size = await Admin.collection.stats({scale: 1024});
    return Size.totalSize
}


//whenever the object gets stringify toJSON() is called so we use it here to hide data
adminSchema.methods.toJSON=function(){
    const user=this
    //get our raw object with user data attached
    //it will remove all the stuff mongoose has on it to perform operations
    const userObject= user.toObject()
    delete userObject.password
    delete userObject.tokens
    //we delete img to dispplay to user bcz it takes much time to fetch binary data of img
    //delete userObject.profilePic
    return userObject

}

//encrypting password
adminSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,SALT_WORK_FACTOR) 
    }
    next()
})

adminSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });
//creating model of moongoose and then creating an instance of model and then saving it
const Admin = mongoose.model('Admin',adminSchema)
module.exports = Admin