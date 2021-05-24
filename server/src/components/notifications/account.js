const sgMail= require('@sendgrid/mail')

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const sendForgetPasswordMail = (email,name)=>{
        sgMail.send({
            to:email,
            from:'digimart.cui@gmail.com',
            subject:'Account Password reset!',
            text:'Hey! Welcome to DigiMart. Your account password has been reset successfully!',
            html:'<strong><New account password: /></br><a href="#" style="background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;">Link Button</a>'
            
        })
    }

    module.exports={
        sendForgetPasswordMail
    }
