const chai = require('chai')
var expect = chai.expect
const chaiHttp = require("chai-http")
const request = require('supertest')
const billing_page = require('../app')
const login = require('../login')
const file = require("../file")
//const login=require('../login')
var sinon = require('sinon');
var alert;
mongoose = require('mongoose')
const { Builder, By, Key, util } = require('selenium-webdriver')
const assert = require('assert');
mongoose.createConnection('mongodb+srv://chiran_siriwardhana:chiransiriwardhana@cluster0-fv81a.mongodb.net/test?retryWrites=true&w=majority');
chai.should()

chai.use(chaiHttp)

//const request=require('supertest')


//const conn_1=require('./public/bilingFunction')
//const conn_2=require('./public/submit')


// ui testings
async function login_test() {
    //console.log("loin_test")
    let driver = await new Builder().forBrowser("firefox").build();
    await driver.get("http://localhost:16000")
}

login_test()

//ui testings

describe("Logout", () => {
    describe("POST /logout", () => {
        it("Redirect to login page", (done) => {
            chai.request(login)
                .get("/logout")
                .end((err, res) => {
                    expect(302)
                    expect('Location', '/');
                    done()

                })
        })
    })
})

describe("login", () => {
    describe("GET /", () => {
        it("Login page", (done) => {
            chai.request(login)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })

    })


    describe("GET /", () => {
        it("It should not get login page", (done) => {
            chai.request(login)
                .get("/test")
                .end((err, res) => {
                    res.should.have.status(404)
                    done()
                })
        })

    })
})



//require('../login')
//const http = require('http');
//const assert = require('assert');
//const cheerio = require('cheerio');

describe('login page', function () {
    describe("POST /data", () => {
        it('Should success if username password role is correct', function (done) {
            chai.request(login)
                .post('/data')
                //.set('Accept','application/json')
                //.set('Content-Type','application/json')
                .send({ Password: 'Nimal@123', Username: 'nimal', Role: 'Technician' })
                //.expect(200)
                //.expect('Content-Type','/json/')
                //.expect(function(response){
                //  expect(response.body).not.to.be.empty;
                //  expect(response.body).to.be.an('object')
                //})
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    expect('Location', '/test.html');
                    //res.body.should.have.property('page').eq(0)
                    done()
                })
        })
    })
});


describe('AlertView', function () {
    beforeEach(function () {
        alert = sinon.spy();
    });

    describe("POST /data", () => {
        it('Should success if username password role is correct', function (done) {
            chai.request(login)
                .post('/data')
                .send({ Password: 'Nimal@123', Username: 'nnn', Role: 'Technician' })

                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    //expect('Location', '/test.html');
                    res.body.should.have.property('page').eq(0)
                    //expect(alert.calledOnce).to.be.false;
                    //expect(alert.args[0][0]).to.equal("There is no matching username or password under given role !!");
                    done()
                })

        });

    });

    describe("POST /data", () => {
        it('Should success if username password role is correct', function (done) {
            chai.request(login)
                .post('/data')
                .send({ Password: 'Sunil@123', Username: 'sss', Role: 'Billing clerk' })

                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    //expect('Location', '/test.html');
                    res.body.should.have.property('page').eq(0)
                    //expect(alert.calledOnce).to.be.false;
                    //expect(alert.args[0][0]).to.equal("There is no matching username or password under given role !!");
                    done()
                })

        });

    });


    // it('should create an alert only when x is true', function() {
    //   generateAlert(true);

    //     expect(alert.calledOnce).to.be.true;
    //   expect(alert.args[0][0]).to.equal(true);
    // });

});


describe('Billing page', function () {
    describe("POST /data", () => {
        it('Should success if username,password and role is correct', function (done) {
            chai.request(login)
                .post('/data')

                .send({ Password: 'Sunil@123', Username: 'sunil', Role: 'Billing clerk' })

                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    expect('Location', '/billing.html');
                    //res.body.should.have.property('page').eq(0)
                    done()
                })
        })
    })
});

/*
require('../app')
const http = require('http');
const cheerio = require('cheerio');
describe('billing page', function() {

    it('get billing page', function(done) {
        const req = http.get('http://localhost:16000/billing.html', function(res) {
            let html = '';
            res.on('data', function(d) {
                html+=d;
            });
            res.on('end', function() {
                const $ = cheerio.load(html);
                assert($('form').length === 1);
                assert($('alert-danger').length === 0);
                done();
            })
        });
        req.end();
    })




})*/

/*require('../app')
describe('billing page', function() {

it('billing page', function(done) {
    const req = http.get('http://localhost:16000/billing.html', function(res) {
        let html = '';
        res.on('data', function(d) {
            html+=d;
        });
        res.on('end', function() {
            const $ = cheerio.load(html);
            assert($('form').length === 1);
            assert($('.alert-danger').length === 1);
            done();
        })
    });
    req.end();
});

});*/



describe("billing--app", () => {
    describe("GET /", () => {


        it("Billing page", (done) => {
            chai.request(billing_page)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200)

                    done();
                });
        });

    })



    describe("POST /api/activities", () => {


        it('should have status 200 after passing data', function (done) {
            chai.request(billing_page)
                .post('/api/activities')
                .send({ appointmentOn: '2020-08-30', appointmentNo: '12', roomNo: '16', consultent: 'Dr.Nimal', cashier: 'kasun', hospitalFee: '500', consultantFee: '1000', finalPayment: '1500', Add: 'Submit' })
                .end((err, res) => {
                    res.should.have.status(200)

                    done();
                });

        });



        /*it("post billing data to database",(done)=>{
        chai.request(app)
            .post("/api/activities")
            .end((err,res)=>{
                res.should.have.status(204)
                //res.body.should.be.a('array')
                done();
            });
    });*/

    })

});


/*describe("Search report using appointment id and diagnosis id",()=>{


    describe('search ', function() {
        it('should load a user', function(done) { // added "done" as parameter

        chai.request(file)
            .post('/upload')
            .end((err,res)=>{
                res.should.have.status(200)
                done()
            })



    });

    });
});*/












