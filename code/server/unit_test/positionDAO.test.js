const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_PT.db');
let db;

const positionDAO = require('../DB/positionDAO.js');
let position_dao;
//const position_dao = new positionDAO(db);

describe('testpositionDAO', () => {
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_PT.db');
        position_dao = new positionDAO(db);
        await position_dao.clear();
    });

    afterEach(async ()=>{
        await position_dao.clear();
        db.dao.close();
    })

    test('[POSITION_0] Delete all Positions', async () => {
        const res = await position_dao.clear();
        expect(res.length).toStrictEqual(0);

        
    });

    test('[POSITION_1] Create Position', async () => {
        await position_dao.createPosition({
            positionID:"000000000000",
            aisleID:"0000",
            row:"0000",
            col:"0000",
            maxWeight:10,
            maxVolume:10});
        
        const res = await position_dao.getAllPositions();
        expect(res.length).toStrictEqual(1);
        
    });

    test('[POSITION_2] Update Position ID', async () => {
        await position_dao.createPosition({
            positionID:"000000000000",
            aisleID:"0000",
            row:"0000",
            col:"0000",
            maxWeight:10,
            maxVolume:10});
        await position_dao.updatePositionID("000000000000", "010000000010")
        const res = await position_dao.getAllPositions().filter(a => a.positionID == "010000000010");
        expect(res.length).toStrictEqual(1);
        
    });


    test('[POSITION_3] Update Occupied Position Values', async () => {
        await position_dao.createPosition({
            positionID:"000000000000",
            aisleID:"0000",
            row:"0000",
            col:"0000",
            maxWeight:10,
            maxVolume:10});
        await position_dao.updateOccupiedPosition("000000000000", 5, 3);
        const res = await position_dao.getAllPositions().filter(a => a.positionID == "000000000000");
        expect(res.length).toStrictEqual(1);
        expect(res[0].occupiedVolume).toStrictEqual(5);
        expect(res[0].occupiedWeight).toStrictEqual(3);
    });

    test('[POSITION_4] Update Position', async () => {
        await position_dao.createPosition({
            positionID:"000000000000",
            aisleID:"0000",
            row:"0000",
            col:"0000",
            maxWeight:10,
            maxVolume:10});
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
        const res = await position_dao.getAllPositions().filter(a => a.positionID == "999999999999");
        expect(res.length).toStrictEqual(1);
        const r = res[0];
        expect(r.positionID).toStrictEqual("999999999999");
    });

    test('[POSITION_5] Delete Position', async () => {
        await position_dao.createPosition({
            positionID:"000000000000",
            aisleID:"0000",
            row:"0000",
            col:"0000",
            maxWeight:10,
            maxVolume:10});
        await position_dao.deletePosition("000000000000")
        const res = await position_dao.getAllPositions();
        expect(res.length).toStrictEqual(0);
        
    });

});
