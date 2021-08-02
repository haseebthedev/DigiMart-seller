const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const message = async (recieverNumber, body) => {   
    
    try{
        const messageSent = await client.messages
        .create({
        to: recieverNumber,
        from: '+18318880686',
        body: body,
        })
        //console.log('m'+ messageSent.sid)
    }
    catch(e){
        throw new Error('SMS could not be sent at this time!')
    }
    
}

module.exports = {message}
