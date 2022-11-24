
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test API_TestResult ', () => {
    
    //first we create a test result record
    AddData(201,'new sku1',100,50,'first sku',14.99, 25);
    AddData(201,'new sku2',150,50,'sec sku',24.99, 10);
    AddData(201,'new sku3',200,50,'third sku',40.00, 2);

    const skuItem ={
        "RFID":"12345678901234567890123456789014",
        "SKUId":2,
        "DateOfStock":"2021/10/01 12:30"
    };
    CreateSKUItem(201,skuItem);
    createNewTestDescriptor(201, "Test descriptor number 1", "This test descriptor is for object with ID = 1", 1);
    const testResult = {
        "rfid":"12345678901234567890123456789014",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    };
    const fakeTest0 ={
        "rfid":"12345678901234567890123456789014",
        "idTestDescriptor":-11,
        "Date":"2021/11/28",
        "Result": true
    }
    const fakeTest1 ={
        "rfid":"12345678901234567890123456789014",
        "idTestDescriptor":5,
        "Date":"2021/11/28",
        "Result": true
    }
    const fakeTest2 ={
        "rfid":"12345678901234517890123456789014",
        "idTestDescriptor":11,
        "Date":"2021/11/28",
        "Result": true
    }
    CreateTestResult(422,fakeTest0);
    CreateTestResult(404,fakeTest1);
    CreateTestResult(404,fakeTest2);
    CreateTestResult(201,testResult);

    //gettin an test result by rfid
    GetAllTestResultsWithRFID(422,'1234567901234567890123456789014');
    GetAllTestResultsWithRFID(404,'12345679012345678901238456789014');
    GetAllTestResultsWithRFID(200,'12345678901234567890123456789014');
    
    //get a specific test result with rfid and id
    GetTestResultByIdAndRFID(422,'1','1234578901234567890123456789014');
    GetTestResultByIdAndRFID(404,'1','12345679012345678901238456789014');
    GetTestResultByIdAndRFID(200,'1','12345678901234567890123456789014');

    //delete a test result

    DeleteTestResult(422,'1','1234578901234567890123456789014');
   
    DeleteTestResult(204,'1','12345678901234567890123456789014');
    deleteTestDescriptor(204, 1);
    DeleteItem(204,"12345678901234567890123456789014")

    deleteData(204,1);
    deleteData(204,2);
    deleteData(204,3);
});

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

function CreateSKUItem(expectedHTTPStatus,newItem) {
    it('Creating a SKUItem', function (done) {
        agent.post('/api/skuitem')
            .send(newItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}
function DeleteItem(expectedHTTPStatus,rfid) {
    it('Deleting a position', function (done) {
        agent.delete('/api/skuitems/'+String(rfid))
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
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

function CreateTestResult(expectedHTTPStatus,newTestResult) {
    it('Creating Test Result', function (done) {
        agent.post('/api/skuitems/testResult')
            .send(newTestResult)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}
function GetAllTestResultsWithRFID(expectedHTTPStatus,rfid) {
    it('Getting all TestResults', function (done) {
        
        agent.get('/api/skuitems/'+String(rfid)+'/testResults')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus); 
                done();
            }).catch(done);
    });
}
function GetTestResultByIdAndRFID(expectedHTTPStatus,id,rfid) {
    it('Getting TestResult with id', function (done) {
        
        agent.get('/api/skuitems/'+String(rfid)+'/testResults/'+String(id))
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus); 
                done();
            }).catch(done);
    });
}
function DeleteTestResult(expectedHTTPStatus,id,rfid) {
    it('Deleting a TestResult', function (done) {
        agent.delete('/api/skuitems/'+String(rfid)+'/testResult/'+String(id))
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
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