const Promise = require("bluebird");

class testResultDAO {
    constructor(dao) {
        this.dao = dao;
    }

    clear(){
        return new Promise((resolve,reject) => {
            const query = 'DELETE FROM TESTRESULT';
            this.dao.dao.run(query, [], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve([]);
                return;
            });
        })
    }

    getTestResults(RFID) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id , idTestDescriptor , Date, Result FROM TESTRESULT WHERE RFID =?';
            this.dao.dao.all(query, [RFID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
                return;
            });
        });
    }
    
    createTestResult(result) {
        
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO TESTRESULT(idTestDescriptor , Date, Result, RFID) VALUES(?, ?, ?, ?) RETURNING id';
            this.dao.dao.get(query, [result.idTestDescriptor, result.Date, result.Result===true?"true":"false", result.rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Inserted TestResult');
                resolve(rows.id);
                return;
            });
        });
    }

    deleteTestResult(id, rfid){
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM TESTRESULT WHERE id=? AND RFID=?';
            this.dao.dao.run(query, [id, rfid], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Deleted TESTRESULT ' + id + " - " + rfid);
                resolve(id);
                return;
            });
        });
    }

    modifyTestResult(id, rfid, testResult){
        return new Promise((resolve, reject) => {
            const query = 'UPDATE TESTRESULT SET idTestDescriptor = ?, Date = ?, Result=? WHERE id=? AND RFID=?';
            this.dao.dao.run(query, [testResult.idTestDescriptor, testResult.Date, testResult.Result===true?"true":"false", id, rfid], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

            resolve(0);
            return;
        });
    }
}

module.exports = testResultDAO;