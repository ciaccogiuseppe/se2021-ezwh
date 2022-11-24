'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test API_Internal Order',()=>{
    deleteAllOrders(200);
    createNewOrder(201,"2021/11/29 09:33",1,[{"SKUId":12,"description":"a product","price":10.99,"qty":3},{"SKUId":180,"description":"another product","price":11.99,"qty":3}])
    createNewOrder(422,undefined,1,[{"SKUId":12,"description":"a product","price":10.99,"qty":3},{"SKUId":180,"description":"another product","price":11.99,"qty":3}])
    createNewOrder(422,"2021/11/29 09:33",1,[{"SKUId":-1,"description":"a product","price":10.99,"qty":3},{"SKUId":180,"description":"another product","price":11.99,"qty":3}])

    getAll(200);

    getIssued(200);

    getAccepted(200);

    getById(200,1);
    getById(422,undefined);
    getById(404,9999999);

    modifyState(200,1,"COMPLETED",[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]);
    modifyState(422,1,undefined,[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]);
    modifyState(404,9999999,"COMPLETED",[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]);

    deleteOrder(204,1);
    deleteOrder(422,undefined);

    deleteAllOrders(200);

    function deleteAllOrders(expectedHTTPStatus){
        it('deleting all internal orders',(done)=>{
            agent.get('/api/internalOrders')
            .then((res)=>{
                //console.log(res.status);
                for (const order of res.body){
                    agent.delete('/api/internalOrders/'+order.id).then(() => {}).catch(done);
                }
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function getAll(expectedHTTPStatus){
        it('getting all internal orders',(done)=>{
            agent.get('/api/internalOrders')
            .then((res)=>{
                //console.log(res.status);
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function getIssued(expectedHTTPStatus){
        it('getting issued orders',(done)=>{
            agent.get('/api/internalOrdersIssued')
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function getAccepted(expectedHTTPStatus){
        it('getting accepted orders',(done)=>{
            agent.get('/api/internalOrdersAccepted')
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function getById(expectedHTTPStatus,id){
        it('getting an order by id= '+id,(done)=>{
            agent.get('/api/internalOrders/'+id)
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function createNewOrder(expectedHTTPStatus,issueDate,customerId,products){
        it('creating a new order',(done)=>{
            agent.post('/api/internalOrders')
            .send({issueDate:issueDate,customerId:customerId,products:products})
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function modifyState(expectedHTTPStatus,orderId,newState,products){
        it('modifying the state of an order',(done)=>{
            agent.put('/api/internalOrders/'+orderId)
            .send({newState:newState,products:products})
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function deleteOrder(expectedHTTPStatus,orderId){
        it('deleting an order',(done)=>{
            agent.delete('/api/internalOrders/'+orderId)
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }
})