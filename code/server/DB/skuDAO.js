const Promise = require("bluebird");

class skuDAO {
    constructor(dao) {
        this.dao = dao;
    }

    clear(){
        return new Promise((resolve,reject) => {
            const query = 'DELETE FROM SKU';
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

    createSKU(sku) {
        //console.log(sku);
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO SKU(DESCRIPTION, WEIGHT, VOLUME, NOTES, PRICE, AVAILABLEQUANTITY) VALUES(?, ?, ?, ?, ?, ?) RETURNING id';
            this.dao.dao.get(query, [sku.description, sku.weight, sku.volume, sku.notes, sku.price, sku.availableQuantity], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Inserted SKU');
                
                resolve(rows.id);
                return;
            });
        });
    }

    getAllSKU(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, description, weight, volume, notes, price, availableQuantity, position FROM SKU';
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

    getSKU(id){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, description, weight, volume, notes, price, availableQuantity, position FROM SKU WHERE id=?';
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

    updateSKU(id, newData, posID){
        return new Promise((resolve, reject) => {
            const query1 = 'UPDATE SKU SET description = ?, weight = ?, volume = ?, notes = ?, price = ?, availableQuantity = ? WHERE id=?';
            this.dao.dao.run(query1, [newData.description, newData.weight, newData.volume, newData.notes, newData.price, newData.availableQuantity, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

            const query2 = 'UPDATE POSITION SET occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?';
            this.dao.dao.run(query2, [newData.weight * newData.availableQuantity, newData.volume * newData.availableQuantity, posID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
            });
            resolve(0);
            return;
        });
    }

    setPosition(id, positionID, weight, volume){
        return new Promise((resolve, reject) => {

            const query1 = 'UPDATE SKU SET position = ? WHERE id = ?'
            this.dao.dao.run(query1, [positionID, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

        
            //console.log(weight, volume);
            const query2 = 'UPDATE POSITION SET occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?'
            this.dao.dao.run(query2, [weight, volume, positionID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows);
                return;
            });

            
        });
    }

    getTestDescriptors(id){
        return new Promise((resolve, reject) => {
            const query = 'SELECT name FROM SKU_TESTDESCRIPTORS WHERE idSKU=?';
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
    
    deleteSKU(id){
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM SKU WHERE id=?';
            this.dao.dao.run(query, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Deleted SKU ' + id);
                resolve(id);
                return;
            });
        });
    }
}

module.exports = skuDAO;