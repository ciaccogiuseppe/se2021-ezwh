const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


/*
const DAO = require('../DB/DAO.js')
const db = new DAO('./DB/ezwh_test.db');

const skuDAO = require('../DB/itemDAO.js');
const sku_dao = new skuDAO(db);
*/

//here we want first to test the '/api/skus' to get all the SKU's
describe('test API_SKU ', () => {
    
    //here assuming that we have already 3 records in the test set
    //with the ids 1,2,3 
    deleteData(204,1);
    deleteData(204,2);
    deleteData(204,3);
    deleteData(422,-1);
    
    //Adding 3 records 
    AddData(201,'new sku1',100,50,'first sku',14.99, 25);
    AddData(201,'new sku2',150,50,'sec sku',24.99, 10);
    AddData(201,'new sku3',200,50,'third sku',40.00, 2);

    //Adding 4th record corrupted and expecting error
    AddData(422,'new sku3',200,50,'third sku',-1, 2);
    
    //Getting all the data
    GetAllData(200);

    //getting an SKU by its id
    GetSKUByID(200,1);
    GetSKUByID(200,2);
    GetSKUByID(200,3);
    GetSKUByID(404,5);
    GetSKUByID(422,-5);

    //add or modify a position of a SKU
    
    // modify an existing SKU using PUT
    const testing0 = {
        newDescription : "a new sku",
        newWeight : 100,
        newVolume : 49,
        newNotes : "first SKU",
        newPrice : 10.99,
        newAvailableQuantity : 50
    } 
    const testing1={
        newDescription : "a new sku",
        newWeight : 0,
        newVolume : 49,
        newNotes : "first SKU",
        newPrice : 10.99,
        newAvailableQuantity : 50
    }
    modifySKU(404,testing0,4);
    modifySKU(422,testing1,1);
    //modifySKU(200,testing0,2);

    //gitting that modified SKU
    deleteData(204,1);
    deleteData(204,2);
    deleteData(204,3);

});

function modifyPosition(expectedHTTPStatus,sku,Id) {
    it('Modify sku by id', function (done) {
    
        agent.put('/api/sku/'+ String(Id)+'/position')
            .send(sku)
            .then(function (res) {
                
                res.should.have.status(expectedHTTPStatus);

               done();
            }).catch(done);;
    });
}
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
function GetAllData(expectedHTTPStatus) {
    it('Getting all data', function (done) {
    
        let total_data = [
            { id:1,
            description: 'new sku1', 
            weight: 100, 
            volume: 50, 
            notes: 'first sku' ,
            price:14.99,
            availableQuantity: 25,
            position: "",
            testDescriptors: []},

            { id:2,
            description: 'new sku2', 
            weight: 150, 
            volume: 50, 
            notes: 'sec sku' ,
            price:24.99,
            availableQuantity: 10,
            position: "",
            testDescriptors: []},

            { id:3,
            description: 'new sku3', 
            weight: 200, 
            volume: 50, 
            notes: 'third sku' ,
            price:40,
            availableQuantity: 2,
            position: "",
            testDescriptors: []}
        ]
        
        agent.get('/api/skus')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);

                for (let i =0 ; i<3; i++){
                    res.body[i].id.should.equal(total_data[i].id);
                    res.body[i].description.should.equal(total_data[i].description);
                    res.body[i].weight.should.equal(total_data[i].weight);
                    res.body[i].volume.should.equal(total_data[i].volume);
                    res.body[i].notes.should.equal(total_data[i].notes);
                    res.body[i].price.should.equal(total_data[i].price);
                    res.body[i].availableQuantity.should.equal(total_data[i].availableQuantity);
                }
                
                done();
            }).catch(done);;
    });
}

function GetSKUByID(expectedHTTPStatus,Id) {
    it('Getting sku by id', function (done) {
    
        let total_data = [
            { id:1,
            description: 'new sku1', 
            weight: 100, 
            volume: 50, 
            notes: 'first sku' ,
            price:14.99,
            availableQuantity: 25,
            position: "",
            testDescriptors: []},

            { id:2,
            description: 'new sku2', 
            weight: 150, 
            volume: 50, 
            notes: 'sec sku' ,
            price:24.99,
            availableQuantity: 10,
            position: "",
            testDescriptors: []},

            { id:3,
            description: 'new sku3', 
            weight: 200, 
            volume: 50, 
            notes: 'third sku' ,
            price:40,
            availableQuantity: 2,
            position: "",
            testDescriptors: []}
        ]
        agent.get('/api/skus/'+ String(Id))
            .then(function (res) {
                // console.log('here');
                res.should.have.status(expectedHTTPStatus);

                for(let i =0 ; i<3 ;i++){
                    // console.log('here');
                    if (total_data[i].id === Id){
                        res.body.id.should.equal(total_data[i].id);
                        res.body.description.should.equal(total_data[i].description);
                        res.body.weight.should.equal(total_data[i].weight);
                        res.body.volume.should.equal(total_data[i].volume);
                        res.body.notes.should.equal(total_data[i].notes);
                        res.body.price.should.equal(total_data[i].price);
                        res.body.availableQuantity.should.equal(total_data[i].availableQuantity);
                    }
                }
                done();
            }).catch(done);;
    });
}

function modifySKU(expectedHTTPStatus,sku,Id) {
    it('Modify sku by id', function (done) {
    
        agent.put('/api/sku/'+ String(Id))
            .send(sku)
            .then(function (res) {
                
                res.should.have.status(expectedHTTPStatus);

               done();
            }).catch(done);;
    });
}