const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test API_Position ', () => {
    
    //testing getting all the positions data
    GetAllPositions(200);

    // test the creating a position
    const newPosition = {
        "positionID":"111299999912",
        "aisleID": "1112",
        "row": "9999",
        "col": "9912",
        "maxWeight": 1000,
        "maxVolume": 1000
    };
    const fakePosition ={
        "positionID":"111299999912",
        "aisleID": "1332",
        "row": "9999",
        "col": "9912",
        "maxWeight": 1000,
        "maxVolume": 1000
    };
    
    CreatePosition(422,fakePosition);
    CreatePosition(201,newPosition);

    
        const ModifiedPosition = {
            "newAisleID": "5552",
            "newRow": "3454",
            "newCol": "3412",
            "newMaxWeight": 1200,
            "newMaxVolume": 600,
            "newOccupiedWeight": 200,
            "newOccupiedVolume":100
        };
        const ModifiedPosition1 = {
            "newAisleID": "5552",
            "newRow": "3454",
            "newMaxVolume": 600,
            "newOccupiedWeight": 200,
            "newOccupiedVolume":100
        };
       //Modifying the data
       modifyPosition(404,111294259912,ModifiedPosition);
       modifyPosition(422,111299999912,ModifiedPosition1);
       modifyPosition(200,111299999912,ModifiedPosition);

       //changing the position id
        const newPosID = {
        "newPositionID": "444411113412"
        };
        const newPosID1 = {
            "hakuna matata":"528252"
            };
        modifyIDOfPosition(404,555230000412,newPosID);
        modifyIDOfPosition(422,555234543412,newPosID1);
        modifyIDOfPosition(200,555234543412,newPosID);

        //Delete a positon
        deletePosition(422,5552345412);
        deletePosition(204,444411113412);
        

});
function GetAllPositions(expectedHTTPStatus) {
    it('Getting all data', function (done) {
        
        agent.get('/api/positions')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus); 
                done();
            }).catch(done);
    });
}

function CreatePosition(expectedHTTPStatus,newPosition) {
    it('Creating a Position', function (done) {
        agent.post('/api/position')
            .send(newPosition)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}
function modifyPosition(expectedHTTPStatus,posId,newPosition) {
    it('Modify position by id', function (done) {
    
        agent.put('/api/position/'+ String(posId))
            .send(newPosition)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
               done();
            }).catch(done);
    });
}
function modifyIDOfPosition(expectedHTTPStatus,posId,newPosition) {
    it('Modify the id of a position', function (done) {
    
        agent.put('/api/position/'+ String(posId)+'/changeID')
            .send(newPosition)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
               done();
            }).catch(done);
    });
}
function deletePosition(expectedHTTPStatus,id) {
    it('Deleting a position', function (done) {
        agent.delete('/api/position/'+String(id))
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }).catch(done);
    });
}
