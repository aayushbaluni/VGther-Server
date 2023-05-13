import twillo from 'twilio'

const accountSid = 'AC41b069d45cfdffdddf9a1206833adb33';
const authToken = '6b564b22f85e2994f5c6ace91debcdd3';

export const getCode = async (req, res) => {

const client = twillo(accountSid, authToken);
    // client
    //     .verify
    //     .services(process.env.VERIFY_SERVICE_SID)
    //     .verifications
    //     .create({
    //         to: `+${req.query.phonenumber}`,
    //         channel: req.query.channel
    //     })
    //     .then(data => {
    //         res.status(200).send(data);
    //     })

    // client.messages
    // .create({
    //   body: 'Hello from twilio-node',
    //   from: '+13184966252',
    //   to: '+919079073202'
    // })
    // .then((message) => console.log(message.sid));
    
client.verify.v2.services('VA2df4b23b228f85e7218a1332bbdb1d9f')
.verifications
.create({to: '+91'+req.body.number, channel: 'sms'})
.then(verification => {
    console.log(verification);
    res.send(verification);
});



};

export const verifyCode = async (req, res) => {
const client = twillo(accountSid, authToken);

    // client
    //     .verify
    //     .services(process.env.VERIFY_SERVICE_SID)
    //     .verificationChecks
    //     .create({
    //         to: `+${req.query.phonenumber}`,
    //         code: req.query.code
    //     })
    //     .then(data => {
    //         res.status(200).send(data);
    //     });
    console.log(req.body.code);
   try{
    client.verify.v2.services('VA2df4b23b228f85e7218a1332bbdb1d9f')
    .verificationChecks
    .create({to: '+919079073202', code: ""+req.body.code})
    .then(verification_check =>{ console.log(verification_check.status);
      res.send(verification_check.status);
  }).catch(e=>{
    console.log(e);
   res.send('error');
  });
   }
   catch(e){
     console.log(e);
    res.send('error');
   }

};