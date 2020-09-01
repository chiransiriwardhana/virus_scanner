const express = require('express')
const fileUpload = require('express-fileupload');
const mongodb = require('mongodb');
const fs = require('fs');
const path = require("path");
const app = express();
const router = express.Router()
const mongoClient = mongodb.MongoClient
const binary = mongodb.Binary
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoose = require('mongoose')
const { Pool } = require('pg')

//const { Client } = require('pg')
//const port = process.env.PORT
//const port = 18000
var MONGODB_URI = 'mongodb+srv://chiran_siriwardhana:chiransiriwardhana@cluster0-fv81a.mongodb.net/test?retryWrites=true&w=majority'
var autoincrement = require('mongoose-autoincrement-id');


const pool = new Pool({
  user: 'uzbobogaegwmzd',
  host: 'ec2-23-20-129-146.compute-1.amazonaws.com',
  database: 'duha2esu1auve',
  password: '54824eccf22233fc5b235f63da1ef5df4c85920aa9f4aa3e59f1563f3c95f739',
  port: 5432,
});

var id;


/*
async function selectFrom(){
  try{
    const res=await pool.query('SELECT * FROM patient_')
    return res.rows[0]
  }catch(err){
    return 
  }
}

*/

router.post('/search', async function search(req, res) {


  console.log(req.body)
  id = parseInt(req.body.patient_info);
  diagnosis_id = parseInt(req.body.diagnosis_id)





  var diagnosisTypeId = await pool.query('SELECT * FROM Diagnosis WHERE appointment_id=$1 AND diagnosis_id=$2', [id, diagnosis_id])
  if (diagnosisTypeId.rows.length != 0) {

    diagnosis = diagnosisTypeId.rows[0]['diagnosis_type_id']
    console.log("diagnosis")
    console.log(diagnosis)
    var diseas = await pool.query('SELECT * FROM Diagnosis_Type WHERE diagnosis_type_id=$1', [diagnosis])
    d = diseas.rows[0]['diagnosis_type']
    console.log("d")
    console.log(d)



    mongoClient.connect(MONGODB_URI || 'mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, db) => {
      if (err) throw err

      var dbo = db.db('report');


      query_ = { _id: diagnosis_id, appointment_id: id }
      dbo.collection('report_types').find(query_).toArray(function (err, result) {
        if (err) throw err;


        var report_not_exist;
        if (result[0] != undefined) {
          report_not_exist = false;


        }
        else {
          report_not_exist = true


        }

        if (report_not_exist) {
          y = "no report for given patient"
        }
        else {

          y = result[0]['report_name'];

        }




        pool.query('SELECT * FROM Appointment WHERE appointment_id  = $1', [id], (error, results) => {
          if (error) {
            throw error
          }
          if (JSON.stringify(results.rows) != "{}") {
            var patient_id = results.rows[0]['patient_id']
            pool.query('SELECT * FROM Patient WHERE patient_id=$1', [patient_id], (error, results) => {
              if (error) throw error

              var full_name = results.rows[0]['first_name'] + " " + results.rows[0]['last_name']
              data = [full_name, results.rows[0]['street'], results.rows[0]['city'], results.rows[0]['email'], y, d]
              //data={first_name:results.rows[0]['first_name'],city:results.rows[0]['city'],street:results.rows[0]['street'],email: results.rows[0]['email'],report_name:y,diagnosis_type:d}
              console.log(res.send(data))
              res.send(data)



            })

          }
          else {
            res.send("")

          }
        })





      });
      //})

    });

  } else {
    console.log(res.send(""))
    res.send("")
  }

});


router.get("/", (req, res) => {

  res.sendFile('/test.html', { root: __dirname + '/views' })



})

router.get("/", (req, res) => {
  getFile(res);
})


//var publicDir = require('path').join(__dirname, '/views');
//app.use(express.static(publicDir));

app.use(fileUpload())

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


router.post("/upload", (req, res) => {

  console.log(diagnosis_id)
  console.log(id)
  pool.query('SELECT * FROM Diagnosis  WHERE diagnosis_id  = $1', [diagnosis_id], (error, results) => {
    if (error) {
      throw error
    }

    else {

      var app_id = results.rows[0]
      var d_id = app_id['diagnosis_id']
      var obj = { _id: d_id, appointment_id: id, document: binary(req.files.uploadedFile.data), status: "upload" }

      insertFile(obj, res)
      console.log("file insrted")
    }


  });
})

function insertFile(obj, res) {
  mongoClient.connect(MONGODB_URI || 'mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, client) => {
    if (err) {
      return err
    }
    else {
      let db = client.db('report')
      let collection = db.collection('reports')
      try {

        collection.insertOne(obj);


      }
      catch (err) {
        console.log("error while inserting file ", err);
      }

      client.close()


      res.status(204).send();


    }

  })

}





function getFiles(res) {

  mongoClient.connect(MONGODB_URI || 'mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
    if (err) {
      return err
    }
    else {
      let db = client.db('patient')
      let collection = db.collection('activities')
      collection.find({}).toArray((err, doc) => {
        if (err) {
          console.log("error in finding doc: ", err)
        }
        else {
          let buffer = doc[0].file.buffer
          fs.writeFileSync('uploadedImage.jpg', buffer)
        }
      })

      client.close()
      res.redirect('/')


    }

  })
}


app.use("/", router)


module.exports = app