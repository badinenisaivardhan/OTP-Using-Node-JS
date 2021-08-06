const express=require('express');
const bodyparser=require('body-parser');
const nodemailer=require('nodemailer');
const path=require('path');
const exphbs=require('express-handlebars');


const app=express();

// view engine setup
app.engine('handlebars',exphbs({ extname: "hbs", defaultLayout: false, layoutsDir: "views/ "}));
app.set('view engine','handlebars');

// body parser middleware
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());


//static folder
app.use('/public',express.static(path.join(__dirname, 'public')));


app.get('/',function(req,res){
    res.render('contact');
});

var email;

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7f157ec5072264",
      pass: "7fe34f67c1b6b5"
    }
});
    
app.post('/send',function(req,res){
    email=req.body.email;
    firstname=req.body.firstname

     // send mail with defined transport object
    var mailOptions={
        to: req.body.email,
       subject: `Otp for registration is: ${otp}`,
       html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
       <div style="margin:50px auto;width:70%;padding:20px 0">
         <div style="border-bottom:1px solid #eee">
           <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
         </div>
         <p style="font-size:1.1em">Hi ${firstname},</p>
         <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
         <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
         <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
         <hr style="border:none;border-top:1px solid #eee" />
         <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
           <p>Your Brand Inc</p>
           <p>1600 Amphitheatre Parkway</p>
           <p>California</p>
         </div>
       </div>
     </div>` // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('otp',{msg:"otp has been sent"});
    });
});

app.post('/verify',function(req,res){

    if(req.body.otp==otp){
       res.render('success')
    }
    else{
        res.render('otp',{msg : 'otp is incorrect'});
    }
});  

app.post('/resend',function(req,res){
  email=req.body.email;
  firstname=req.body.firstname

    var mailOptions={
        to: email,
       subject: `Otp for registration is: ${otp}`,
       html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
       <div style="margin:50px auto;width:70%;padding:20px 0">
         <div style="border-bottom:1px solid #eee">
           <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
         </div>
         <p style="font-size:1.1em">Hi ${firstname},</p>
         <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
         <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
         <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
         <hr style="border:none;border-top:1px solid #eee" />
         <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
           <p>Your Brand Inc</p>
           <p>1600 Amphitheatre Parkway</p>
           <p>California</p>
         </div>
       </div>
     </div>` // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        res.render('otp',{msg:"otp has been sent"});
    });

});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`app is live at ${PORT}`);
})