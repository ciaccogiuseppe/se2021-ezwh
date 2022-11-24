const Promise = require("bluebird");

class testDescriptorDAO {
    constructor(dao) {
        this.dao = dao;
    }

    clear(){
        return new Promise((resolve,reject) => {
            const query = 'DELETE FROM SKU_TESTDESCRIPTORS';
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

    createTestDescriptor(item) {
        
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO SKU_TESTDESCRIPTORS(name , procedureDescription , idSKU) VALUES(?, ?, ?) RETURNING id';
            this.dao.dao.get(query, [item.name, item.procedureDescription , item.idSKU], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Inserted TestDescriptor');
                resolve(rows.id);
                return;
            });
            
        });
    }

    getAllTestDescriptors(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id , name , procedureDescription , idSKU FROM SKU_TESTDESCRIPTORS';
            this.dao.dao.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
                return;
            });
        });
    }

    getTestDescriptorById(id){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id , name , procedureDescription , idSKU FROM SKU_TESTDESCRIPTORS WHERE id =?';
            this.dao.dao.all(query, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
                return;
            });
        });
    }

    
    modifyTestDescriptor(id, newData){
        return new Promise((resolve, reject) => {
            const query = 'UPDATE SKU_TESTDESCRIPTORS SET name = ?, procedureDescription = ?, idSKU=? WHERE id=?';
            this.dao.dao.run(query, [newData.newName, newData.newProcedureDescription,newData.newIdSKU, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

            resolve(0);
            return;
        });
    }


    deleteTestDescriptor(id){
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM SKU_TESTDESCRIPTORS WHERE id=?';
            this.dao.dao.run(query, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Deleted SKU_TESTDESCRIPTORS ' + id);
                resolve(id);
                return;
            });
        });
    }
}

module.exports = testDescriptorDAO;