const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_TR.db');
let db;

const testResultDAO = require('../DB/testResultDAO.js');
let testResult_dao;
//const testResult_dao = new testResultDAO(db);

describe('testResultDAOError', () => {

    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_TR_EMPTY.db');
        testResult_dao = new testResultDAO(db);
    });

    afterEach(async ()=>{
        db.dao.close();
    })

    test('[ERR_TESTRESULT_0] Delete all TestResults', async () => {
        try{
            await testResult_dao.clear();
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_TESTRESULT_1] Create TestResults', async () => {
        try{
            await testResult_dao.createTestResult({
                rfid:"12345678901234567890123456789015",
                idTestDescriptor:"14",
                Date:"2021/11/28",
                Result:true
            })
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }

        try{
            await testResult_dao.getTestResults("12345678901234567890123456789015");
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_TESTRESULT_2] Modify TestResults', async () => {
        try{
            await testResult_dao.modifyTestResult(id, "12345678901234567890123456789015", {
                idTestDescriptor:5,
                Date:"2021/07/28",
                Result:false}
                );
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });

    test('[ERR_TESTRESULT_3] Delete TestResult', async () => {
        try{
            await testResult_dao.deleteTestResult(0, "12345678901234567890123456789015")
        }
        catch(er){
            expect(er).toEqual(expect.anything());
        }
    });
});
