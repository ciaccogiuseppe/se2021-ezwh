const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test API_Item ', () => {

    AddData(201,'new sku1',100,50,'first sku',14.99, 25);
    AddData(201,'new sku2',150,50,'sec sku',24.99, 10);
    AddData(201,'new sku3',200,50,'third sku',40.00, 2);
    //first we create 2 Items
    const item1 ={
        id: 12,
        description: 'a new item',
        price: 10.99,
        SKUId: 1,
        supplierId: 2
      }
    const item2 ={
        id: 13,
        description: 'a new item',
        price: 35.99,
        SKUId: 3,
        supplierId: 2
      }
      const item3 ={
        id: 13,
        description: 'a new item',
        price: -35.99,
        SKUId: 3,
        supplierId: 2
      }
      const item4 ={
        id: 13,
        price: -35.99,
        SKUId: 3,
        supplierId: 2
      }
      DeleteAllItems(200);
      CreateItem(422,item4);
      CreateItem(422,item3);
      CreateItem(201,item1);
      CreateItem(201,item2);
      
      //now modifying an item
      const newItem = {
      "newDescription" : "a super new item",
      "newPrice" : 49.99
    }
      ModifyItem(404,'15',newItem,2);
      ModifyItem(200,'12',newItem,2);

      //Getting all the items
      GetAllItems(200);

      //Getting an item with its id

      GetItemById(422,-5,2);
      GetItemById(404,5,2);
      GetItemById(200,12,2);
     
      //Deleting the 2 items

      DeleteItem(204,12,2);
      DeleteItem(204,13,2);

      DeleteAllItems(200);
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

function DeleteAllItems(expectedHTTPStatus){
    it('deleting all items',(done)=>{
        agent.get('/api/items')
        .then((res)=>{
            //console.log(res.status);
            for (const item of res.body){
                agent.delete('/api/items/'+item.id).then(() => {}).catch(done);
            }
            res.should.have.status(expectedHTTPStatus);
            done();
        }).catch(done);
    })
}

function CreateItem(expectedHTTPStatus,newItem) {
    it('Creating an Item', function (done) {
        agent.post('/api/item')
            .send(newItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}
function ModifyItem(expectedHTTPStatus,id,newItem, supplierID) {
    it('Modify Item by id', function (done) {
    
        agent.put('/api/item/'+ String(id) +"/"+String(supplierID))
            .send(newItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
               done();
            }).catch(done);
    });
}
function DeleteItem(expectedHTTPStatus,id,supplierID) {
    it('Deleting a position', function (done) {
        agent.delete('/api/items/'+String(id)+"/"+String(supplierID))
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}
function GetAllItems(expectedHTTPStatus) {
    it('Getting all Items', function (done) {
        
        agent.get('/api/items')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus); 
                done();
            }).catch(done);
    });
}
function GetItemById(expectedHTTPStatus,id, supplierID) {
    it('Getting Item with id', function (done) {
        
        agent.get('/api/items/'+String(id)+"/"+String(supplierID))
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus); 
                done();
            }).catch(done);
    });
}
