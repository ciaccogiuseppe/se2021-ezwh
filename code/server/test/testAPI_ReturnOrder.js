'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test API_Return Order',()=>{
    before(function(done) {
        /*let sku = {
            description: "a SKU",
            weight: 1,
            volume: 1,
            notes: "notes",
            price: 1.0,
            availableQuantity: 12}
            
        agent.post('/api/sku')
            .send(sku)
            .then(agent.post('/api/sku')
                .send(sku)
                .then(agent.post('/api/sku')
                .send(sku)
                .then(done()))).catch(done);*/

        agent.post('/api/restockOrder')
        .send({issueDate:"2021/11/28 09:33",supplierId:1,products:[]})
        .then(()=>{
            done();
        }).catch(done);
        
        
    })

    after(function(done){
        /*agent.delete('/api/sku/1')
            .send()
            .then(
                agent.delete('/api/sku/2')
                    .send()
                    .then(
                        agent.delete('/api/sku/3')
                        .send()
                        .then(done())
                    )
                ).catch(done);
        ;*/

        agent.delete('/api/restockOrder/1')
        .send()
        .then(()=>{
            done();
        }).catch(done);
        
    })
    
    createNewOrder(201,"2021/11/29 09:33",1,4,[{"SKUId":12,"itemId":18,"description":"a product","price":10.99,"rfid":"12345678901234567890123456789016"},{"SKUId":180,"itemId":11,"description":"another product","price":11.99,"rfid":"12345678901234567890123456789038"}]);
    createNewOrder(422,undefined,undefined,undefined,undefined);
    createNewOrder(422,"2021/11/29 09:33",-1,4,[{"SKUId":12,"itemId":12,"description":"a product","price":10.99,"rfid":"12345678901234567890123456789016"},{"SKUId":180,"itemId":28,"description":"another product","price":11.99,"rfid":"12345678901234567890123456789038"}]);

    getAll(200);

    getById(200,1);
    getById(422,-1);
    getById(404,9999999);

    deleteOrder(204,1);
    deleteOrder(422,-1);

    function getAll(expectedHTTPStatus){
        it('getting all return orders',(done)=>{
            agent.get('/api/returnOrders')
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function getById(expectedHTTPStatus,id){
        it('getting an order by id= '+id,(done)=>{
            agent.get('/api/returnOrders/'+id)
            .then((res)=>{
                //console.log(res.status);
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function createNewOrder(expectedHTTPStatus,returnDate,restockOrderId,supplierId,products){
        it('creating a new order',(done)=>{
            agent.post('/api/returnOrder')
            .send({returnDate:returnDate,restockOrderId:restockOrderId,products:products,supplierId:supplierId})
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function deleteOrder(expectedHTTPStatus,orderId){
        it('deleting an order',(done)=>{
            agent.delete('/api/returnOrder/'+orderId)
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }
})