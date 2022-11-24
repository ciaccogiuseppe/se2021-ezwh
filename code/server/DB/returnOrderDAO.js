const Promise = require("bluebird");

class returnOrderDAO {
    constructor(dao) {
        this.dao = dao;
    }

    clear(){
        return new Promise((resolve,reject) => {
            const query = 'DELETE FROM RETURN_ORDER';
            const query2 = 'DELETE FROM RETURN_ORDER_PRODUCT';
            this.dao.dao.run(query, [], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.dao.dao.run(query2, [], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve([]);
                    return;
                });
            });
        })
    }
    
    createReturnOrder(RO) {
        console.log(RO);
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO RETURN_ORDER(returnDate,restockOrderId,supplierId) VALUES(?, ?,?) RETURNING id';
            this.dao.dao.get(query, [RO.returnDate, RO.restockOrderId,RO.supplierId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const id = rows.id;
                {
                const query2 = 'INSERT INTO RETURN_ORDER_PRODUCT (orderId, productId,itemId, description, price, RFID) VALUES (?, ?, ?, ?, ?)'
                    for (const p of RO.products){
                        this.dao.dao.run(query2, [id, p.SKUId,p.itemId, p.description, p.price, p.rfid], (err) =>{
                            if (err) {
                                reject(err);
                                return;
                            }
                        })
                    }
                }
                //console.log('Inserted Return Order');
                resolve(id);
                return;
            });
        });
    }

    getAllRO(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id , returnDate , restockOrderId FROM RETURN_ORDER';
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

    getProducts(id){
        return new Promise((resolve, reject) => {
            const query = 'SELECT productId, description, price, RFID FROM RETURN_ORDER_PRODUCT WHERE orderId=?';
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

    getRO(id){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id , returnDate , restockOrderId FROM RETURN_ORDER WHERE id=?';
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
    
    deleteRO(id){
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM RETURN_ORDER WHERE id=?';
            this.dao.dao.run(query, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                const query2 = 'DELETE FROM RETURN_ORDER_PRODUCT WHERE orderId=?'
                this.dao.dao.run(query2, [id], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                });
                //console.log('Deleted RO ' + id);
                resolve(id);
                return;
            });
        });
    }

    getItemID(SKUId, supplierID) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id FROM ITEM WHERE SKUId=? AND supplierId=?';
            this.dao.dao.get(query, [SKUId, supplierID], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                } else if(row===undefined){
                    throw new TypeError("can't select any item with SKUid="+SKUId+" and supplierID="+supplierID);
                } else {
                resolve(row.id);
                return;
                }
            });
        });
    }

    getSupplierIdByRestockOrder(restockOrderId){
        return new Promise((resolve,reject)=>{
            const query = 'SELECT supplierId FROM RESTOCK_ORDER WHERE id=?';
            this.dao.dao.get(query,[restockOrderId],(err,row)=>{
                if(err){
                    reject(err);
                }  else if(row===undefined){
                    throw new TypeError("can't select any RESTOCK_ORDER with id="+restockOrderId);
                } else {
                    resolve(row.supplierId);
                }
            })
        })
    }
}

module.exports = returnOrderDAO;