//const Promise = require("bluebird");

class restockOrderDAO {
    constructor(dao) {
        this.dao = dao;
    }

    clear(){
        return new Promise((resolve,reject) => {
            const query = 'DELETE FROM RESTOCK_ORDER';
            const query2 = 'DELETE FROM TRANSPORT_NOTE';
            const query3 = 'DELETE FROM RESTOCK_ORDER_PRODUCT'
            const query4 = 'DELETE FROM RESTOCK_ORDER_PRODUCT_RFID'
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
                    this.dao.dao.run(query3, [], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        this.dao.dao.run(query4, [], (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
            
                            resolve([]);
                            return;
                        });
                    });
                });
            });
        })
    }

    getAllRestockOrders(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, issueDate, state, supplierId FROM RESTOCK_ORDER';
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
            const query = 'SELECT productId, description, price, quantity FROM RESTOCK_ORDER_PRODUCT WHERE orderId=?';
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

    getTransportNote(id){
        return new Promise((resolve, reject) => {
            const query0 = 'SELECT transportNote FROM RESTOCK_ORDER WHERE id=?';
            this.dao.dao.get(query0, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const tNote = rows.transportNote;
                const query = 'SELECT deliveryDate FROM TRANSPORT_NOTE WHERE id=?';
                this.dao.dao.get(query, [tNote], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows)
                    return;
                });
            });
            
        });
    }

    getSkuItems(id){
        return new Promise((resolve, reject) => {
            const query = 'SELECT orderId, productId, rfid FROM RESTOCK_ORDER_PRODUCT_RFID WHERE orderId=?';
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

    getItemID(SKUId, supplierID) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id FROM ITEM WHERE SKUId=? AND supplierId=?';
            this.dao.dao.all(query, [SKUId, supplierID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
                return;
            });
        });
    }

    getRestockOrdersState(state){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, issueDate, state, supplierId FROM RESTOCK_ORDER WHERE state=?';
            this.dao.dao.all(query, [state], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
                return;
            });
        });
    }

    getRestockOrder(id){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, issueDate, state, supplierId FROM RESTOCK_ORDER WHERE id=?';
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

    modifyRestockOrderState(id, restockOrder){
        return new Promise((resolve, reject) => {
            const query = 'UPDATE RESTOCK_ORDER SET state = ? WHERE id=?';
            this.dao.dao.run(query, [restockOrder.state, id], (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }
            });


            resolve(0);
            return;
        });
    }

    modifyRestockOrderTransportNote(id, restockOrder){
        //console.log(internalOrder);
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO TRANSPORT_NOTE (deliveryDate) VALUES (?) RETURNING id';
            this.dao.dao.all(query, [restockOrder.transportNote.deliveryDate], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const tId = rows[0].id;
                const query2 = 'UPDATE RESTOCK_ORDER SET transportNote = ? WHERE id=?';
                this.dao.dao.run(query2, [tId, id], (err, rows) => {
                    
                    if (err) {
                        reject(err);
                        return;
                    }
                });
                
                resolve(0);
                return;
            });


            
        });
    }

    modifyRestockOrderProducts(id,supplierID, restockOrder){
        //console.log(internalOrder);
        //console.log(restockOrder);
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO RESTOCK_ORDER_PRODUCT_RFID(orderId, supplierId , productId, rfid) VALUES (?, ?, ?, ?)';
            for (const p of restockOrder.skuItems){
                this.dao.dao.run(query, [id,supplierID, p.SKUId, p.rfid], (err)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                })
            }
            resolve(0);
            return;
        });
    }

    insertRestockOrder(order){
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO RESTOCK_ORDER (issueDate, state, supplierId) VALUES (?, ?, ?) RETURNING id';
            this.dao.dao.all(query, [order.issueDate, "ISSUED", order.supplierId], (err, rows) => {
                //console.log(rows);
                if (err) {
                    reject(err);
                    return;
                }
                const id = rows[0].id;
                {
                    const query2 = 'INSERT INTO RESTOCK_ORDER_PRODUCT (orderId, productId, itemId, quantity, description, price) VALUES (?, ?, ?, ?, ?)'
                    for (const p of order.products){
                        this.dao.dao.run(query2, [id, p.SKUId, p.itemId, p.qty, p.description, p.price], (err) =>{
                            if (err) {
                                reject(err);
                                return;
                            }
                        })
                    }
                }
                resolve(id);
                return;
            });
            
        });
    }

    async deleteRestockOrder(id){
        return new Promise((resolve, reject) => {
            const query0 =  'DELETE FROM TRANSPORT_NOTE WHERE id IN (SELECT transportNote FROM RESTOCK_ORDER WHERE id = ?)'
            this.dao.dao.run(query0, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                const query = 'DELETE FROM RESTOCK_ORDER WHERE id=?';
                this.dao.dao.run(query, [id], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const query2 = 'DELETE FROM RESTOCK_ORDER_PRODUCT WHERE orderId=?'
                    this.dao.dao.run(query2, [id], (err) => {
                        const query3 = 'DELETE FROM RESTOCK_ORDER_PRODUCT_RFID WHERE orderId=?'
                        this.dao.dao.run(query3, [id], (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                        });
                        if (err) {
                            reject(err);
                            return;
                        }
                    });
                });
                resolve(id);
                return;
            })
        });
    }
}

module.exports = restockOrderDAO;