const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_TD.db');
let db;

const testDescriptorDAO = require('../DB/testDescriptorDAO.js');
//const testDescriptor_dao = new testDescriptorDAO(db);
let testDescriptor_dao;

describe('testDescriptorDAO', () => {
    
    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_TD.db');
        testDescriptor_dao = new testDescriptorDAO(db);
        await testDescriptor_dao.clear();
    });

    afterEach(async ()=>{
        await testDescriptor_dao.clear();
        db.dao.close();
    })

    test('[TESTDESCRIPTOR_0] Delete all TestDescriptors', async () => {
        const res = await testDescriptor_dao.clear();
        expect(res.length).toStrictEqual(0);

        
    });

    test('[TESTDESCRIPTOR_1] Create TestDescriptor', async () => {
        await testDescriptor_dao.createTestDescriptor({
            name: "test descriptor",
            procedureDescription: "test described by...",
            idSKU: 1
        })
        const res = await testDescriptor_dao.getAllTestDescriptors();
        expect(res.length).toStrictEqual(1);
    });

    test('[TESTDESCRIPTOR_2] Get all TestDescriptors', async () => {
        await testDescriptor_dao.createTestDescriptor({
            name: "test descriptor 1",
            procedureDescription: "test described by...",
            idSKU: 1
        })
        await testDescriptor_dao.createTestDescriptor({
            name: "test descriptor 2",
            procedureDescription: "test described by...",
            idSKU: 2
        })
        const res = await testDescriptor_dao.getAllTestDescriptors();
        expect(res.length).toStrictEqual(2);
    });

    test('[TESTDESCRIPTOR_3] Get TestDescriptor by id', async () => {
        const id = await testDescriptor_dao.createTestDescriptor({
            name: "test descriptor 1",
            procedureDescription: "test described by...",
            idSKU: 1
        })
        const res = await testDescriptor_dao.getTestDescriptorById(id);
        expect(res.length).toStrictEqual(1);
        const test = res[0];
        expect(test.name).toStrictEqual("test descriptor 1");
        expect(test.procedureDescription).toStrictEqual("test described by...");
        expect(test.idSKU).toStrictEqual(1);
    });

    test('[TESTDESCRIPTOR_4] Modify TestDescriptor', async () => {
        const id = await testDescriptor_dao.createTestDescriptor({
            name: "test descriptor 1",
            procedureDescription: "test described by...",
            idSKU: 1
        })

        await testDescriptor_dao.modifyTestDescriptor(id, {
            newName: "test descriptor update 2",
            newProcedureDescription: "test2 described by...",
            newIdSKU: 2
        })

        const res = await testDescriptor_dao.getTestDescriptorById(id);
        expect(res.length).toStrictEqual(1);
        const test = res[0];
        expect(test.name).toStrictEqual("test descriptor update 2");
        expect(test.procedureDescription).toStrictEqual("test2 described by...");
        expect(test.idSKU).toStrictEqual(2);
    });

    test('[TESTDESCRIPTOR_5] Delete TestDescriptors', async () => {
        const id1 = await testDescriptor_dao.createTestDescriptor({
            name: "test descriptor 1",
            procedureDescription: "test described by...",
            idSKU: 1
        })
        const id2 = await testDescriptor_dao.createTestDescriptor({
            name: "test descriptor 2",
            procedureDescription: "test described by...",
            idSKU: 2
        })
        const res = await testDescriptor_dao.getAllTestDescriptors();
        expect(res.length).toStrictEqual(2);
        await testDescriptor_dao.deleteTestDescriptor(id1);
        const res1 = await testDescriptor_dao.getAllTestDescriptors();
        expect(res1.length).toStrictEqual(1);
        await testDescriptor_dao.deleteTestDescriptor(id2);
        const res2 = await testDescriptor_dao.getAllTestDescriptors();
        expect(res2.length).toStrictEqual(0);
    });
});
