'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const agent = chai.request.agent(app);


describe('test API_TestDescriptor', () => {
    AddData(201,'new sku1',100,50,'first sku',14.99, 25);
    AddData(201,'new sku2',150,50,'sec sku',24.99, 10);
    AddData(201,'new sku3',200,50,'third sku',40.00, 2);

    
    createNewTestDescriptor(404, "Test descriptor number 50", "This test descriptor is for object with ID = 50", 50);
    createNewTestDescriptor(422, undefined, undefined, undefined);
    createNewTestDescriptor(422, "Test", "Decriptor", "Number");
    createNewTestDescriptor(201, "Test descriptor number 1", "This test descriptor is for object with ID = 1", 1);

    getAll(200);

    getTestDescriptorById(200, 1);
    getTestDescriptorById(404, 9999999);
    getTestDescriptorById(422, -1);
    getTestDescriptorById(422, "Test");

    updateTestDescriptorById(200, 1, "New test descriptor name", "New test procedure", 1);
    updateTestDescriptorById(422, undefined, "Test", "Procedure", 1);
    updateTestDescriptorById(404, 999,  "Test", "Procedure", 1);
    //updateTestDescriptorById(404, 1, "Procedure", 999);

    deleteTestDescriptor(204, 1);
    deleteTestDescriptor(422, "Test");
    //deleteTestDescriptor(422, 999);
    deleteTestDescriptor(422, -2);
    deleteData(204,1);
    deleteData(204,2);
    deleteData(204,3);

    function deleteData(expectedHTTPStatus,id) {
        it('Deleting data', function (done) {
            agent.delete('/api/skus/'+String(id))
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);;
        });
    }
    
    function AddData(expectedHTTPStatus,description, weight,volume,notes,price,availableQuantity) {
        it('Adding data', function (done) {
            let sku = { description: description, weight: weight, volume: volume, notes: notes ,price:price,availableQuantity: availableQuantity}
                
            agent.post('/api/sku')
                .send(sku)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);;
        });
    }

    function getAll(expectedHTTPStatus) {
        it('Getting all test descriptors', (done) => {
            agent.get('/api/testDescriptors')
                .then((res) => {
                    //console.log(res.status);
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        })
    }

    function getTestDescriptorById(expectedHTTPStatus, id) {
        it('Getting a test descriptor by ID = ' + id, (done) => {
            agent.get('/api/testDescriptors/' + id)
                .then((res) => {
                    //console.log(res.status);
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        })
    }

    function createNewTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU) {
        it('creating a new test descriptor', (done) => {
            agent.post('/api/testDescriptor')
                .send({name: name, procedureDescription: procedureDescription, idSKU: idSKU})
                .then((res) => {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        })
    }

    function updateTestDescriptorById(expectedHTTPStatus, id, newName, newProcedureDescriptor, newIdSKU){
        it('Modifying the test descriptor with ID = ' + id,(done)=>{
            agent.put('/api/testDescriptor/'+ id)
                .send({newName: newName, newProcedureDescription: newProcedureDescriptor, newIdSKU: newIdSKU})
                .then((res)=>{
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        })
    }

    function deleteTestDescriptor(expectedHTTPStatus, id) {
        it('Deleting test descriptor with ID = ' + id, (done) => {
            agent.delete('/api/testDescriptor/' + id)
                .then((res) => {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }).catch(done);
        })
    }
})
