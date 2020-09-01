const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
var JSAlert = require("js-alert");
var alert = require('sweetalert');
var port = process.env.PORT
//var port=5000
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
const { Pool } = require('pg');

const pool = new Pool({
  user: 'uzbobogaegwmzd',
  host: 'ec2-23-20-129-146.compute-1.amazonaws.com',
  database: 'duha2esu1auve',
  password: '54824eccf22233fc5b235f63da1ef5df4c85920aa9f4aa3e59f1563f3c95f739',
  port: 5432,

});


//views = require('path').join(__dirname,'/views');
//app.use(express.static(views));

app.use('/', function (req, res, next) {
  next();
});

app.get('/', function (req, res) {


  res.sendFile('/billing.html', { root: __dirname + '/views' })

});

app.get('/api/getActivities', function (req, res) {
  console.log('get activities');
  Activity.find({}).then(eachOne => {
    res.json(eachOne);
  });
});

/*app.post('/logout',function(req,res){
   res.redirect(301,"https://login--sign-up--form.herokuapp.com/")
})*/

app.post("/api/activities", (req, res) => {

  var string = JSON.stringify(req.body);

  var objectValue = JSON.parse(string);

  var spawn = require('child_process').spawn
  var py = spawn('python', ['rsa_encryption_billing.py'])
  var data = [objectValue['appointmentOn'], objectValue['appointmentNo'], objectValue["roomNo"], objectValue['consultent'], objectValue['cashier'], objectValue['hospitalFee'], objectValue['consultantFee']]
  var str_list = [];




  py.stdout.on('data', function (data) {
    str_data = data.toString();
    str_list = str_data.split("/");


  });




  py.stdout.on('end', function (data) {

    objectValue['appointmentOn'] = str_list[0]
    objectValue['appointmentNo'] = str_list[1]
    objectValue["roomNo"] = str_list[2]
    objectValue['consultent'] = str_list[3]
    objectValue['cashier'] = str_list[4]
    objectValue['hospitalFee'] = str_list[5]
    objectValue['consultantFee'] = str_list[6]




    const query = `INSERT INTO Payment (paid_date,appointment_no,room_no,doctor,cashier,hospital_charge,doctor_charge,appointment_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`
    const values = [objectValue['appointmentOn'], objectValue['appointmentNo'], objectValue["roomNo"], objectValue['consultent'], objectValue['cashier'], objectValue['hospitalFee'], objectValue['consultantFee'], 3]

    pool.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      else {
        console.log("inserted to database")
      }


    });




  });

  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
  console.log("send")
  console.log(res.send())
  res.status(200).send();
  //res.send(204).send()

})




/*app.post('/api/activities',function(req,res){
Activity.create({
  hospitalFee:req.body.hospitalFee,
  consultentFee:req.body.consultentFee
  }).then(activity=>{
      res.json(activity);
  });
  res.send();
});
*/

app.get('/api/activities/:activity_id', function (req, res) {
  Activity.findById(req.params.activity_id).then(function (err, activity) {
    if (err) {
      res.send(err);
    }
    res.json(activity);
  });
});


module.exports = app
