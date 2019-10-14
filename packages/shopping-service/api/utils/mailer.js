const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/config');
const { readHTMLFile } = require('./utils/readFiles');
const handlebars = require('handlebars');

const sendEmail = (email, subject, templatePath, replacements) => new Promise((resolve, reject) => {
    const mailOptions = emailConfig.options;
    mailOptions.to = email;
    mailOptions.subject = subject;

    const transporter = nodemailer.createTransport(emailConfig.transportConfig);

    readHTMLFile(templatePath, async (err, html) => {
        const template = handlebars.compile(html);
        const htmlToSend = template(replacements);
        mailOptions.html = htmlToSend;
        try {
            const info = await transporter.sendMail(mailOptions);
            resolve(info);
        } catch (error) {
            console.log('error', error)
            reject(error)
        }
        
    });
});

module.exports = {
    sendEmail
}