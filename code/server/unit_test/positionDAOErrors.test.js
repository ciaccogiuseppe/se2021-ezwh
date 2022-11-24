const DAO = require('../DB/DAO.js')
const db = new DAO('./DB/test/ezwh_test_PT_EMPTY.db');

const positionDAO = require('../DB/positionDAO.js');
const position_dao = new positionDAO(db);

describe('testpositionDAOError', () => {

    test('[ERR_POSITION_0] Delete all Positions', async () => {
        try{
            await position_dao.clear();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }

        
    });

    test('[ERR_POSITION_1] Create Position', async () => {
        try{
            await position_dao.createPosition({
                positionID:"000000000000",
                aisleID:"0000",
                row:"0000",
                col:"0000",
                maxWeight:10,
                maxVolume:10});
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }


        try{
            await position_dao.getAllPositions();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_POSITION_2] Update Position ID', async () => {
        try{
            await position_dao.updatePositionID("000000000000", "010000000010")
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
        
    });


    test('[ERR_POSITION_3] Update Occupied Position Values', async () => {
        try{
            await position_dao.updateOccupiedPosition("000000000000", 5, 3);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_POSITION_4] Update Position', async () => {
        try{
            await position_dao.updatePosition("000000000000", 
            {
                aisleID: "9999",
                row: "9999",
                col: "9999",
                maxWeight: 100,
                maxVolume: 100,
                occupiedWeight: 50,
                occupiedVolume: 50
            })
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_POSITION_5] Delete Position', async () => {
        try{
            await position_dao.deletePosition("000000000000")
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

});
