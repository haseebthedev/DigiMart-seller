const mongoose=require('mongoose')
mongoose.connect((process.env.MONGODB_URL),{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}, (error) => {
    if(!error){
        console.log('Connected successfully!')
    }
    else{
        console.log('connection error: '+error)
    }
})
