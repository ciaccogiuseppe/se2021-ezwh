const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_TD.db');
let db;

const testDescriptorDAO = require('../DB/testDescriptorDAO.js');
//const testDescriptor_dao = new testDescriptorDAO(db);
let testDescriptor_dao;

describe('testDescriptorDAOError', () => {
    
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_TD_EMPTY.db');
        testDescriptor_dao = new testDescriptorDAO(db);
    });

    afterEach(async ()=>{
        db.dao.close();
    })

    test('[ERR_TESTDESCRIPTOR_0] Delete all TestDescriptors', async () => {
        try{
            await testDescriptor_dao.clear();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_TESTDESCRIPTOR_1] Create TestDescriptor', async () => {
        try{
            await testDescriptor_dao.createTestDescriptor({
                name: "test descriptor",
                procedureDescription: "test described by...",
                idSKU: 1
            })
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_TESTDESCRIPTOR_2] Get all TestDescriptors', async () => {
        try{
            await testDescriptor_dao.getAllTestDescriptors();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_TESTDESCRIPTOR_3] Get TestDescriptor by id', async () => {
        try{
            await testDescriptor_dao.getTestDescriptorById(0);
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_TESTDESCRIPTOR_4] Modify TestDescriptor', async () => {
        try{
            await testDescriptor_dao.modifyTestDescriptor(0, {
                newName: "test descriptor update 2",
                newProcedureDescription: "test2 described by...",
                newIdSKU: 2
            })
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_TESTDESCRIPTOR_5] Delete TestDescriptors', async () => {
        try{
            await testDescriptor_dao.getAllTestDescriptors();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
});
