//require('dotenv').config()
const express = require('express')
const app = express()
const mongodb = require("mongodb")
const mongoClient = mongodb.MongoClient
const { Pool } = require('pg')
app.use(express.urlencoded())

const router = express.Router()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = new Pool({
  user: 'uzbobogaegwmzd',
  host: 'ec2-23-20-129-146.compute-1.amazonaws.com',
  database: 'duha2esu1auve',
  password: '54824eccf22233fc5b235f63da1ef5df4c85920aa9f4aa3e59f1563f3c95f739',
  port: 5432,
})

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));
let port=process.env.PORT   
//let port=4000


function encrypt(enteredData) {
    var spawn = require("child_process").spawn
    py = spawn('python', ['rsa_encryption.py']),
        data = enteredData,
        encryptData = "",
        encrypt_list = [],
        list_ = []

    py.stdout.on('data', function (data) {
        encryptData += data.toString()
        encrypt_list = encryptData.split("\n");

    });

    py.stdout.on('end', function () {
      
    })

    py.stdin.write(JSON.stringify(data));
    py.stdin.end();





}



app.post('/data', (req, res) => {
    var data_all = req.body
    
    var usrname_and_password=[data_all['Username'], data_all['Password']];

    var objectValue=[];
    var spawn=require('child_process').spawn
    var py    = spawn('python', ['rsa_encryption.py'])
    var data=usrname_and_password
    var str_list=[];

     
    py.stdout.on('data', function(data){
        str_data=data.toString();
        str_list=str_data.split("/");
        
 
    });


    py.stdout.on('end',function(data){

        objectValue[0]=str_list[0]
        objectValue[1]=str_list[1]
    
    
    var role=data_all['Role']
    
    if(role=='Technician'){
    
    query=`SELECT  * FROM Technician WHERE password=$1`

    values =[objectValue[1]]
    pool.query(query,values, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        else{
            var found=false;
            for(var i=0;i<results.rows.length;i++){
               
                if(results.rows[i]['username']==objectValue[0]){
                        found=true
                        break
                }
                
            }
            
            if(found==true){
                res.send({page:4})
            }
            else{
                res.send({page:0})
            }

            
          
        }
       
        
      });
      
    }
    else if(role=='Billing clerk'){
       
        query=`SELECT  * FROM Billing_clerk WHERE password=$1`

        values =[objectValue[1]]
        
        pool.query(query,values, (err, results) => {
            if (err) {
                console.error(err);
                return;
            }
            else{
                var found=false;
                for(var i=0;i<results.rows.length;i++){
                   
                    if(results.rows[i]['username']==objectValue[0]){
                            found=true
                            break
                    }
                    
                }
                
                if(found==true){
                    res.send({page:3})
                }
                else{
                    res.send({page:0})
                }
    
                
              
            }
           
            
          });

    }
    else{
        console.log("noting happen!!!")
    }

});

   
   py.stdin.write(JSON.stringify(data));
   py.stdin.end();
   
})
 

app.get("/", (req, res) => {

    res.sendFile('/technicianLogin.html', { root: __dirname })
})




/*app.post("/upload",function(req,res){

  var role_name=req.body.role_type
  console.log(role_name)
  var query='INSERT INTO role (role_name) VALUES ($1)'
  var values=[role_name]

  pool.query(query,values,(err,results)=>{
      if(err) throw err
      console.log("insert data to database successfully")
  })   
  


})*/




app.use("/", router)

app.listen(port , () => {
    console.log('Server started')
});