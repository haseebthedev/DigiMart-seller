const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const message = (recieverNumber, body) => {
	client.messages
		.create({
			to: recieverNumber,
			from: "+18318880686",
			body: body,
		})
		//console.log('m'+ messageSent.sid)
		.then((message) => console.log(message.sid));
};

module.exports = { message };
