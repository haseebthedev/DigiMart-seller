const sgMail = require("@sendgrid/mail");
const resetPassword = require("./Email-template/forgetPassword");
const accountNotifications = require("./Email-template/accountUpdate");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendForgetPasswordMail = (email, name, link) => {
	sgMail.send({
		to: email,
		from: process.env.BUSINESS_EMAIL,
		subject: "Password Change Request",
		// text: "Hey ! Welcome to DigiMart. Your account password has been reset successfully!",
		html: resetPassword.emailTemplate(link, name),
	});
};
const sendNotificationMail = (email, subject, message, name) => {
	sgMail.send({
		to: email,
		from: process.env.BUSINESS_EMAIL,
		subject: subject,
		html: accountNotifications.emailTemplate(message, name),
	});
};

const sendReportProblemMail = (email, subject, message, name) => {
	sgMail.send({
		to: process.env.BUSINESS_EMAIL,
		from: email,
		subject: subject,
		html: accountNotifications.emailTemplate(message, name),
	});
};

module.exports = {
	sendForgetPasswordMail,
	sendNotificationMail,
	sendReportProblemMail,
};
