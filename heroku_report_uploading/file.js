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
const port = process.env.PORT
//const port = 16000
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



//routes============================
async function selectFrom(){
  try{
    const res=await pool.query('SELECT * FROM patient_')
    return res.rows[0]
  }catch(err){
    return 
  }
}





router.post('/search', async (req, res)=> {



  id = parseInt(req.body.patient_info);

 
  var diagnosisTypeId=await pool.query('SELECT * FROM Diagnosis WHERE appointment_id=$1',[id] )
  diagnosis=diagnosisTypeId.rows[0]['diagnosis_type_id']
  console.log("diagnosis")
  console.log(diagnosis)
  var diseas=await pool.query('SELECT * FROM Diagnosis_Type WHERE diagnosis_type_id=$1',[diagnosis])
  d=diseas.rows[0]['diagnosis_type']
  console.log("d")
  console.log(d)



 mongoClient.connect(MONGODB_URI||'mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, db) => {
    if(err) throw err

    var dbo = db.db('report');
    var query = { _id:id };
    console.log("query")
    console.log(query)
    console.log("query")
    dbo.collection('reports').find(query).toArray(function(err, result) {
        if (err) throw err;
        var x=result[0]['report_type_id'];
        console.log("result x")
        console.log(x);
       

        query_={_id:x}
        dbo.collection('report_types').find(query_).toArray(function(err, result) {
          if (err) throw err;
          y=result[0]['report_name'];
          console.log("result y")
          console.log(y);

          pool.query('SELECT * FROM Appointment WHERE appointment_id  = $1', [id], (error, results) => {
            if (error) {
              throw error
            }
            if (JSON.stringify(results.rows) != "{}") {
              var patient_id=results.rows[0]['patient_id']
              pool.query('SELECT * FROM Patient WHERE patient_id=$1',[patient_id],(error,results)=>{
                if(error) throw error
                data = [results.rows[0]['first_name'], results.rows[0]['city'], results.rows[0]['street'], results.rows[0]['email'],y,d]
                res.send(data)
              })
              
            }
            else {
              res.send("")
        
            }
          })
        




  });
})

 });



});


router.get("/", (req, res) => {
  res.sendFile('/test.html', { root: __dirname })
})

router.get("/", (req, res) => {
  getFile(res);
})


var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));
app.use(fileUpload())

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


router.post("/upload", (req, res) => {

  console.log(id)
  
  pool.query('SELECT * FROM Appointment  WHERE appointment_id  = $1', [id], (error, results) => {
    if (error) {
      throw error
    }

    else {

      var app_id = results.rows[0]
      var id = app_id['appointment_id']
      let file = { $set: { document: binary(req.files.uploadedFile.data), status: " upload" } }
      insertFile(file, id, res)
      console.log("file insrted")
    }


  });
})

function insertFile(file, app_id, res) {
  mongoClient.connect(MONGODB_URI||'mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, client) => {
    if (err) {
      return err
    }
    else {
      let db = client.db('report')
      let collection = db.collection('reports')
      try {
        collection.update({ _id: app_id }, file);
        

      }
      catch (err) {
        console.log("error while inserting file ", err);
      }

      client.close()
      res.redirect('/')


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

app.listen(port);