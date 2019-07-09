const CronJob = require('cron').CronJob;
const express = require('express');
const axios = require('axios');
let nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "[email]",
        pass: "*******"
    }
});


const ticketUrl = 'https://ms2019.ticketportal.sk/Event/Performance/QuickpurchasePerf/14200007';
//const ticketUrl = 'https://ms2019.ticketportal.sk/Event/Performance/QuickpurchasePerf/14200073';

const onComplete = ()=>{
  console.log('Job has stopped');
};

const job = new CronJob('0 */1 * * * *', () => {

    axios.get(ticketUrl).then((result) => {
        const d = new Date();
        console.log(d, result.data);
        if(result.data.ReturnedObject !== null || result.data.ResultStatus !== 'NoRecords'){
            let mailOptions = {
                from: "[from_Email]",
                to: "[to_email]",
                subject: `BUY SLOVAKIA - USA Ice Hockey Tickets !!!`,
                text: `${d} ,resultStatus: ${JSON.stringify(result.data.ResultStatus)}`
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    throw error;
                } else {
                    console.log("Email successfully sent!");
                }
            });
            job.stop();
        }
    });
},onComplete);


job.start();
console.log(`Job is running: ${job.running}`);

const app = express();
const PORT = 8300;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});