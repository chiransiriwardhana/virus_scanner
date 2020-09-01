//require('dotenv').config()
const express = require('express')
const app = express()
const mongodb = require("mongodb")
const mongoClient = mongodb.MongoClient
const { Pool } = require('pg')
app.use(express.urlencoded())
const path = require('path')
const router = express.Router()
const session = require('express-session');
const billing = require('./app.js')
const file = require('./file')

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'ssshhhhh', maxAge: 3600000, saveUninitialized: true, resave: true, cookie: { secure: true } }));



const pool = new Pool({
  user: 'uzbobogaegwmzd',
  host: 'ec2-23-20-129-146.compute-1.amazonaws.com',
  database: 'duha2esu1auve',
  password: '54824eccf22233fc5b235f63da1ef5df4c85920aa9f4aa3e59f1563f3c95f739',
  port: 5432,
})

/*
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tempery',
    password: 'Chiran@123',
    port: 5432,
})*/







var views = require('path').join(__dirname, '/views');
app.use(express.static(views));



let port = process.env.PORT
//let port=16000
var sess;

var user;


function encrypt(enteredData) {
    var spawn = require("child_process").spawn
    py = spawn('python', ["rsa_encryption.py"]),
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


app.post('/api/activities', billing);
app.post('/search', file)
app.post('/upload', file)

function setName(username) {

    query = `SELECT  * FROM Technician WHERE username=$1`

    values = [username]
    var name;
    pool.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        else {
            name = results.rows[0]['first_name'] + " " + results.rows[0]['last_name']


        }
    })
    return name;
}

app.post('/data', (req, res) => {

    sess = req.session;
    sess.role = req.body.Role
    sess.username = req.body.Username;
    sess.password = req.body.Password;
    user = sess.Username




    var usrname_and_password = [sess.username, sess.password]


    var spawn = require('child_process').spawn
    var py = spawn('python', ["rsa_encryption.py"])
    var data = usrname_and_password
    var str_list = [];




    py.stdout.on('data', function (data) {

        str_list = data.toString().split("/");
    })



    py.stdout.on('end', function (data) {

        Validate(req, res, sess.role, str_list[0], str_list[1]);

    })



    py.stdin.write(JSON.stringify(data));
    py.stdin.end();


})


// Authentication Strategy Begin=============================================================================

function Validate(req, res, role, username, password) {


    if (role == 'Technician') {

        query = `SELECT  * FROM Technician WHERE password=$1`

        values = [password]
        pool.query(query, values, (err, results) => {
            if (err) {
                console.error(err);
                return;
            }
            else {
                var found = false;

                for (var i = 0; i < results.rows.length; i++) {

                    if (results.rows[i]['username'] == username) {
                        console.log("Encrypted username for Technician")
                        console.log(username)
                        console.log("Encrypted password for Technician")
                        console.log(password)
                        found = true
                        break
                    }

                }

                if (found == true) {


                    res.send({ page: 4 })


                }
                else {


                    res.send({ page: 0, found: false })

                }

            }

        });

    }
    else if (role == 'Billing clerk') {

        query = `SELECT  * FROM Billing_clerk WHERE password=$1`

        values = [password]

        pool.query(query, values, (err, results) => {
            if (err) {
                console.error(err);
                return;
            }
            else {
                var found = false;
                for (var i = 0; i < results.rows.length; i++) {

                    if (results.rows[i]['username'] == username) {
                        console.log("Encrypted username for Billing clerk")
                        console.log(username)
                        console.log("Encrypted password for Billing clerk")
                        console.log(password)
                        found = true
                        break
                    }

                }

                if (found == false) {
                    console.log(found)


                    res.send({ page: 0 })

                }
                else {


                    res.send({ page: 3 })


                    /*
                    query=`SELECT  * FROM Billing_clerk WHERE username=$1`
   
                    values =[username]
                    var name;
                    pool.query(query,values, (err, results) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        else{
                            name=results.rows[0]['first_name']+" "+results.rows[0]['last_name']  
                            res.render("billing",{clerk_name:name})
            
                        }
                    })*/


                }



            }


        });

    }
    else {
        console.log("noting happen!!!")
    }

}


// Authentication Strategy end==================================================================




app.get('/showAlert', (req, res) => {

    res.send({ page: 0 })
})


app.post('/logout', (req, res) => {

    sess.destroy((err) => {
        if (err) {
            return console.log(err)
        }


        res.redirect('/')
        console.log("session destroyed!!!")

    });
})



app.get("/", (req, res) => {


    res.sendFile('/technicianLogin.html', { root: __dirname + '/views' })

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



//module.exports=app.listen(16000, () => {
//  console.log('Server started')
//});

const login = app.listen(port, () => { console.log('Server started') })

//const login=app.listen(port)

module.exports = login