const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test API_SKUItem ', () => {
    //first we will create a SKUItem
    const skuItem ={
        "RFID":"88888888901234567890123456789015",
        "SKUId":2,
        "DateOfStock":"2021/10/01 12:30"
    };
    const skuItemfake0 ={
        "RFID":"88888888901234567899015",
        "SKUId":2,
        "DateOfStock":"2021/10/01 12:30"
    };
    const skuItemfake1 ={
        "RFID":"88888888901234567890123456789015",
        "SKUId":5,
        "DateOfStock":"2021/10/01 12:30"
    };
    const skuItemfake2 ={
        "RFID":"88888888901234567899015",
        "SKUId":2,
        "DateOfStock":"10/01 12:30"
    };

    AddData(201,'new sku1',100,50,'first sku',14.99, 25);
    AddData(201,'new sku2',150,50,'sec sku',24.99, 10);
    AddData(201,'new sku3',200,50,'third sku',40.00, 2);
    CreateSKUItem(404,skuItemfake1);
    CreateSKUItem(422,skuItemfake0);
    CreateSKUItem(422,skuItemfake2);
    CreateSKUItem(201,skuItem);
    
    //second we edit the created SKUItem with different RFID
    const newRFID ={
        "newRFID":"77777777701234567890123456789015",
        "newAvailable":1,
        "newDateOfStock":"2021/11/29 12:30"
    }
    const fakeSKUItem ={
        "newRFID":"77777777701234567890123456789015",
        "newAvailable":-5,
        "newDateOfStock":"2021/11/29 12:30"
    }
    ModifyRFID(404,'888234567890123456789015',newRFID);
    ModifyRFID(422,'88888888901234567890123456789015',fakeSKUItem);
    ModifyRFID(200,'88888888901234567890123456789015',newRFID);

    //third we git the item with its id

    GetItemById(422,-1);
    GetItemById(404,20);
    GetItemById(200,2);
    
    //forth we git the item with its RFID

    GetItemByRFID(422,'888234567890123456789015');
    GetItemByRFID(404,'88888888901234567890123456789015');
    GetItemByRFID(200,"77777777701234567890123456789015");

    //fifth we get all the items
    GetAllItems(200);
    //sixth we delete the item
    DeleteItem(422,"77777774567890123456789015")
    DeleteItem(204,"77777777701234567890123456789015")
    DeleteItem(204,"88888888901234567890123456789015")

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
function ModifyRFID(expectedHTTPStatus,rfid,newSKUItem) {
    it('Modify SKUItem by RFID', function (done) {
    
        agent.put('/api/skuitems/'+ String(rfid))
            .send(newSKUItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
               done();
            }).catch(done);
    });
}

function GetAllItems(expectedHTTPStatus) {
    it('Getting all Items', function (done) {
        
        agent.get('/api/skuitems')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus); 
                done();
            }).catch(done);
    });
}
function GetItemById(expectedHTTPStatus,id) {
    it('Getting Items with the same id', function (done) {
        
        agent.get('/api/skuitems/sku/'+String(id))
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus); 
                done();
            }).catch(done);
    });
}
function GetItemByRFID(expectedHTTPStatus,rfid) {
    it('Getting Item with its RFID', function (done) {
        
        agent.get('/api/skuitems/'+String(rfid))
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
