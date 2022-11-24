const DAO = require('../DB/DAO.js')
//const db = new DAO('./DB/test/ezwh_test_TR.db');
let db;

const testResultDAO = require('../DB/testResultDAO.js');
let testResult_dao;
//const testResult_dao = new testResultDAO(db);

describe('testResultDAO', () => {

    beforeEach(async () => {
        db = new DAO('./DB/test/ezwh_test_TR.db');
        testResult_dao = new testResultDAO(db);
        await testResult_dao.clear();
    });

    afterEach(async ()=>{
        await testResult_dao.clear();
        db.dao.close();
    })

    test('[TESTRESULT_0] Delete all TestResults', async () => {
        const res = await testResult_dao.clear();
        expect(res.length).toStrictEqual(0);
    });

    test('[TESTRESULT_1] Create TestResults', async () => {
        const id = await testResult_dao.createTestResult({
            rfid:"12345678901234567890123456789015",
            idTestDescriptor:"14",
            Date:"2021/11/28",
            Result:true
        })
        const res = await testResult_dao.getTestResults("12345678901234567890123456789015");
        expect(res.length).toStrictEqual(1);
    });

    test('[TESTRESULT_2] Modify TestResults', async () => {
        const id = await testResult_dao.createTestResult({
            rfid:"12345678901234567890123456789015",
            idTestDescriptor:14,
            Date:"2021/11/28",
            Result:true
        })

        await testResult_dao.modifyTestResult(id, "12345678901234567890123456789015", {
            idTestDescriptor:5,
            Date:"2021/07/28",
            Result:false}
            );
        const res = await testResult_dao.getTestResults("12345678901234567890123456789015");
        expect(res.length).toStrictEqual(1);
        expect(res[0].idTestDescriptor).toStrictEqual(5);
        expect(res[0].Date).toStrictEqual("2021/07/28");
        expect(res[0].Result).toStrictEqual("false");
    });

    test('[TESTRESULT_3] Delete TestResult', async () => {
        const id1 = await testResult_dao.createTestResult({
            rfid:"12345678901234567890123456789015",
            idTestDescriptor:"14",
            Date:"2021/11/28",
            Result:true
        });

        const id2 = await testResult_dao.createTestResult({
            rfid:"43245678901234567890123456789015",
            idTestDescriptor:"13",
            Date:"2021/07/28",
            Result:false
        });
        const res1 = await testResult_dao.getTestResults("12345678901234567890123456789015");
        expect(res1.length).toStrictEqual(1);
        await testResult_dao.deleteTestResult(id1, "12345678901234567890123456789015")
        const res2 = await testResult_dao.getTestResults("12345678901234567890123456789015");
        expect(res2.length).toStrictEqual(0);


        const res3 = await testResult_dao.getTestResults("43245678901234567890123456789015");
        expect(res3.length).toStrictEqual(1);
        await testResult_dao.deleteTestResult(id2, "43245678901234567890123456789015")
        const res4 = await testResult_dao.getTestResults("43245678901234567890123456789015");
        expect(res4.length).toStrictEqual(0);
    });
});
