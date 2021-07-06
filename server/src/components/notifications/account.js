const sgMail = require("@sendgrid/mail");
const resetPassword = require("./Email-template/forgetPassword");
const registration = require("./Email-template/accountUpdate");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendForgetPasswordMail = (email, name, password) => {
  sgMail.send({
    // to: email,
    // from: "digimart.cui@gmail.com",
    // subject: "Account Password reset!",
    // text: "Hey ! Welcome to DigiMart. Your account password has been reset successfully!",
    // html: resetPassword.emailTemplate(password, name),
  });
};
const sendNotificationMail = (email, subject, message, name) => {
  sgMail.send({
    // to: email,
    // from: "digimart.cui@gmail.com",
    // subject: subject,
    // html: registration.emailTemplate(message, name),
  });
};

module.exports = {
  sendForgetPasswordMail,
  sendNotificationMail,
};
