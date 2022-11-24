const Promise = require("bluebird");

class itemDAO {
    constructor(dao) {
        this.dao = dao;
    }

    clear(){
        return new Promise((resolve,reject) => {
            const query = 'DELETE FROM ITEM';
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
    
    createNewItem(item) {
        
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO ITEM(id, description , price , SKUId, supplierId) VALUES(?, ?, ?, ?, ?) RETURNING id';
            //console.log([item.id, item.description, item.price , item.SKUId, item.supplierId]);
            this.dao.dao.get(query, [item.id, item.description, item.price , item.SKUId, item.supplierId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Inserted Item');
                resolve(rows.id);
                return;
            });
            
        });
    }

    getAllItems(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id , description , price , SKUId, supplierId FROM ITEM';
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

    getItemById(id,supplierId){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id , description , price , SKUId FROM ITEM WHERE id =? AND supplierId =?';
            this.dao.dao.all(query, [id, supplierId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
                return;
            });
        });
    }

    
    modifyItem(id,supplierId, newData){
        return new Promise((resolve, reject) => {
            const query = 'UPDATE ITEM SET description = ?, price = ? WHERE id=? AND supplierId=?';
            this.dao.dao.run(query, [newData.newDescription, newData.newPrice, id,supplierId], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
            });

            resolve(0);
            return;
        });
    }


    deleteItem(id,supplierId){
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM ITEM WHERE id=? AND supplierId =?';
            this.dao.dao.run(query, [id,supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Deleted item ' + id);
                resolve(id);
                return;
            });
        });
    }
}

module.exports = itemDAO;