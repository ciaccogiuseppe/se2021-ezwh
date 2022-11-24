'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test API_user',() => {
    //the database must have the initial users
    login(200,"manager1@ezwh.com","testpassword","manager");

    addNewUser(201,"a@a.com","name","surname","testPassword","customer");
    addNewUser(409,"a@a.com","name","surname","testPassword","customer");
    addNewUser(422,"b","name","surname","testPassword","customer");

    updateType(422,undefined,undefined,undefined);
    updateType(404,"b@b.com","qualityEmployee","supplier");
    updateType(200,"a@a.com","customer","supplier");
    updateType(200,"a@a.com","supplier","customer");

    deleteUser(204,"a@a.com","customer");
    deleteUser(422,"a","b");
    deleteUser(204,"b@b.com","customer");

    const userTypes = ["customer", "qualityEmployee", "clerk", "deliveryEmployee", "supplier"];
    userTypes.forEach((type)=>{
        addNewUser(201,"a@a.com","name","surname","testPassword",type);
        login(401,"a@a.com","wrongPassword",type);
        login(200,"a@a.com","testPassword",type);
        getUserInfo(200);
        logout(200);
        if(type==="suppliers"){
            getSuppliers(200,"a@a.com");
        }
        deleteUser(204,"a@a.com",type);
    })


    function deleteUser(expectedHTTPStatus,username,type){
        it('deleting data',(done) => {
            agent.delete('/api/users/'+username+'/'+type)
            .then((res)=>{
                //console.log(res.status);
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function addNewUser(expectedHTTPStatus,username,name,surname,password,type){
        it('adding a new user',(done)=>{
            const user={
                username:username,
                name:name,
                surname:surname,
                password:password,
                type:type
            }
            agent.post('/api/newUser')
            .send(user)
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function login(expectedHTTPStatus,username,password,type){
        it('logging in a '+type,(done)=>{
            agent.post('/api/'+type+'Sessions')
            .send({username:username,password:password})
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function getSuppliers(expectedHTTPStatus,username){
        it('getting all the suppliers',(done)=>{
            agent.get('/api/suppliers')
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                res.body.username.should.equal(username);
                done();
            }).catch(done);
        })
    }

    function getUserInfo(expectedHTTPStatus){
        it('getting user info',(done)=>{
            agent.get('/api/userinfo')
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
            //to do when sessions are implemented
        })
    }
 
    function logout(expectedHTTPStatus){
        it('logging out',(done)=>{
            agent.post('/api/logout')
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);;
        })
    }

    function updateType(expectedHTTPStatus,username,oldType,newType){
        it('updating type',(done)=>{
            agent.put('/api/users/'+username)
            .send({oldType:oldType,newType:newType})
            .then((res)=>{
                //console.log(res.status);
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }
})