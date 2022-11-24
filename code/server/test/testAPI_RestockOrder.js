'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test API_Restock Order',()=>{
    /*beforeAll((done) => { //Before each test we empty the database
        Book.remove({}, (err) => { 
           done();           
        });        
    });*/

    deleteAllOrders(200);
    
    createNewOrder(201,"2021/11/29 09:33",1,[]);
    createNewOrder(422,"2021/11/29 09:33",undefined,[]);
    createNewOrder(422,"2021/11/29 09:33",2,[{"SKUId":undefined}]);

    getAll(200);

    modifySkuItems(422,1,[{"SKUId":12,"description":"a product","price":10.99,"qty":30},{"SKUId":180,"description":"another product","price":11.99,"qty":20}]);

    modifyState(200,1,"DELIVERED");
    modifyState(422,1,undefined);
    modifyState(404,924,"DELIVERED");

    modifySkuItems(200,1,[{"SKUId":12,"description":"a product","price":10.99,"qty":30},{"SKUId":180,"description":"another product","price":11.99,"qty":20}],1);
    modifySkuItems(422,undefined,[],1);
    modifySkuItems(404,924,[{"SKUId":12,"description":"a product","price":10.99,"qty":30},{"SKUId":180,"description":"another product","price":11.99,"qty":20}],1);

    addTransportNote(422,1,{"deliveryDate":"2021/12/29"});
    modifyState(200,1,"DELIVERY");
    addTransportNote(200,1,{"deliveryDate":"2021/12/29"});
    addTransportNote(422,undefined,{"deliveryDate":"2021/12/29"});
    addTransportNote(404,924,{"deliveryDate":"2021/12/29"});

    

    getIssued(200);

    getById(200,1);
    getById(422,undefined);
    getById(404,924);

    getItems(422,1);
    modifyState(200,1,"COMPLETEDRETURN");
    getItems(200,1);
    getItems(422,undefined);
    getItems(404,924);
    getItems(200,1);

    deleteOrder(422,undefined);
    deleteOrder(204,1);
    deleteAllOrders(200);

    function deleteAllOrders(expectedHTTPStatus){
        it('deleting all internal orders',(done)=>{
            agent.get('/api/restockOrders')
            .then((res)=>{
                //console.log(res.status);
                for (const order of res.body){
                    agent.delete('/api/restockOrder/'+order.id).then(() => {}).catch(done);
                }
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function getAll(expectedHTTPStatus){
        it('getting all restock orders',(done)=>{
            agent.get('/api/restockOrders')
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function getIssued(expectedHTTPStatus){
        it('getting issued orders',(done)=>{
            agent.get('/api/restockOrdersIssued')
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function getById(expectedHTTPStatus,id){
        it('getting an order by id= '+id,(done)=>{
            agent.get('/api/restockOrders/'+id)
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function getItems(expectedHTTPStatus,orderId){
        it('getting items from an order',(done)=>{
            agent.get('/api/restockOrders/'+orderId+'/returnItems')
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function createNewOrder(expectedHTTPStatus,issueDate,supplierId,products){
        it('creating a new order',(done)=>{
            agent.post('/api/restockOrder')
            .send({issueDate:issueDate,supplierId:supplierId,products:products})
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function modifyState(expectedHTTPStatus,orderId,newState){
        it('modifying the state of an order',(done)=>{
            agent.put('/api/restockOrder/'+orderId)
            .send({newState:newState})
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function modifySkuItems(expectedHTTPStatus,orderId,listOfSkuItems,supplierID){
        it('modifying the list of skuItems of an order',(done)=>{
            agent.put('/api/restockOrder/'+orderId+'/'+supplierID+'/skuItems')
            .send({skuItems:listOfSkuItems})
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function addTransportNote(expectedHTTPStatus,orderId,transportNote){
        it('adding transport note to an order',(done)=>{
            agent.put('/api/restockOrder/'+orderId+'/transportNote')
            .send({transportNote:transportNote})
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }

    function deleteOrder(expectedHTTPStatus,orderId){
        it('deleting an order',(done)=>{
            agent.delete('/api/restockOrder/'+orderId)
            .then((res)=>{
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
        })
    }
})