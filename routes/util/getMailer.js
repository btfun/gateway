var nodemailer = require('nodemailer');
var conf = require("../../conf");
var emailObj=conf.email;

var transporter = nodemailer.createTransport({
    host: emailObj.host,
    port: emailObj.port,
    secure: false, // use SSL
    auth: {
        user: emailObj.user,
        pass: emailObj.pass
    }
});


module.exports.sendMail=function(obj){
    var mailOptions = {
        from: '"saas.web 👥" <'+emailObj.from+'>', // sender address
        to: emailObj.receivers.join(', '), // list of receivers
        subject: obj.subject,              // Subject line
        text: obj.text,                    // plaintext body
        html: '<span>'+obj.text+'</span>'  // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });


}
