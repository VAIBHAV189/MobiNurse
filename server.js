const exp = require('express');
const app = exp();
const nodemailer=require('nodemailer')

const fs=require('fs')
const PDFDOCUMENT=require('pdfkit')
const blobStream = require('blob-stream');

app.use(exp.json())
app.use(exp.urlencoded({extended:true})) 

app.use('/',exp.static(__dirname+'/public'));
app.use('/patient',exp.static(__dirname + '/public/patient'));
app.use('/doctor',exp.static(__dirname + '/public/doctor'));

app.post("/genPDF",(req,res)=>{
    let doc=new PDFDOCUMENT()
    let stream = doc.pipe(blobStream());
    // console.log(req.body.txt)
    doc.pipe(fs.createWriteStream('./public/patient/Downloads/Prescription.pdf'))
    doc.fillColor('red').text("Prescription",{
        align:"center",
    })
    doc.fillColor('blue').text(req.body.txt)
    doc.fillColor('green').text("\n\nSIGNATURE",{
        align:"right",
    })
    // doc.image('./public/Signature.jpg',{
    //     align:"left",
    //     fit:[70,200]
    // })
    doc.end()   
    res.send('success');
})

app.post('/sendmail',function(req,res){
    let transport = nodemailer.createTransport({
        service : "gmail",
        host: 'smtp.gmail.com',
        // port: 5500,
        // tls: {
        //     rejectUnauthorized: false
        // }
        auth: { 
           user: 'achintdawra740@gmail.com',
           pass: 'dawra740'
        }
    });
    // console.log(req.body);
    const message = {
        from: 'noreply@sih.com', // Sender address
        to: 'agamdawra01@gmail.com',  // List of recipients
        subject: 'Mail Testing', // Subject line
        text : req.body.msg, // Plain text body
        attachments: [{
            filename: 'Prescription.pdf',
            path: './public/patient/Downloads/Prescription.pdf',
            contentType: 'application/pdf'
        }]
    };

    transport.sendMail(message, function(err, info) {
        if (err) {
        console.log(err)
        } else {
        console.log(info);
        }
    });
    res.send("Success");
});

app.listen(5500,()=>{
    console.log('Server Started at http://localhost:5500');
});


