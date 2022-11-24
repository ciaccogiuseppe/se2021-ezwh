const Promise = require("bluebird");

class skuitemDAO {
    constructor(dao) {
        this.dao = dao;
    }
    clear(){
        return new Promise((resolve,reject) => {
            const query = 'DELETE FROM SKU_Item';
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

    createSKUItem(skui) {
        
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO SKU_Item(RFID, Available, SKUId, DateOfStock) VALUES(?, ?, ?, ?)';
            this.dao.dao.run(query, [skui.RFID, 0, skui.SKUId, skui.DateOfStock], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Inserted SKU Item');
                resolve(0);
                return;
            });
        });
    }

    getAllSKUItems(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT RFID , SKUId , Available , DateOfStock FROM SKU_Item';
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

    getSKUItemsById(SKUId){
        return new Promise((resolve, reject) => {
            const query = 'SELECT RFID , SKUId ,  DateOfStock FROM SKU_Item WHERE Available = 1 AND SKUId =?';
            this.dao.dao.all(query, [SKUId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
                return;
            });
        });
    }

    getSKUItemByRFID(RFID){
        return new Promise((resolve, reject) => {
            const query = 'SELECT RFID , SKUId , Available, DateOfStock FROM SKU_Item WHERE RFID =?';
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

    updateSKUItem(RFID, newData){
        return new Promise((resolve, reject) => {
            const query = 'UPDATE SKU_Item SET RFID = ?, Available = ?, DateOfStock = ? WHERE RFID=?';
            this.dao.dao.run(query, [newData.newRFID, newData.newAvailable, newData.newDateOfStock, RFID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

            resolve(0);
            return;
        });
    }


    deleteSKUItem(RFID){
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM SKU_Item WHERE RFID=?';
            this.dao.dao.run(query, [RFID], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Deleted Sku item ' + RFID);
                resolve(RFID);
                return;
            });
        });
    }
}

module.exports = skuitemDAO;