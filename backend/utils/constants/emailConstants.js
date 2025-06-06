const fs=require('fs');
const path=require('path');

const forgotPasswordMailContent={
    subject:"Password Reset",
    html:fs.readFileSync(path.resolve(__dirname,'../' ,'view', 'forgot-password-template.html'), 'utf-8'),
    from:"",
    to:"" 
}

const userRegistrationMailContent={
    subject:"Welcome to Property Plateau",
    html:fs.readFileSync(path.resolve(__dirname,'../' ,'view', 'user-registration-template.html'), 'utf-8'),
    from:"",
    to:"" 
}

const propertyRegistrationMailContent={
    subject:"Proprty Added Successfully",
    html:fs.readFileSync(path.resolve(__dirname,'../' ,'view', 'property-registration-template.html'), 'utf-8'),
    from:"",
    to:"" 
}

const appointmentMailContent = {
    subject: "Appointment Scheduled Successfully",
    html: fs.readFileSync(path.resolve(__dirname, '../view', 'appointment-template.html'), 'utf-8'),
    from: process.env.EMAIL_ID,
    to: "" // to be dynamically set
  }

module.exports={forgotPasswordMailContent,userRegistrationMailContent,propertyRegistrationMailContent,appointmentMailContent}
