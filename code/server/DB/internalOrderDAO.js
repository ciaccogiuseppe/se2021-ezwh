const Promise = require("bluebird");

class internalOrderDAO {
    constructor(dao) {
        this.dao = dao;
    }


    clear(){
        return new Promise((resolve,reject) => {
            const query = 'DELETE FROM INTERNAL_ORDER';
            const query2 = 'DELETE FROM INTERNAL_ORDER_PRODUCT';
            const query3 = 'DELETE FROM PRODUCT_RFID';
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
                        resolve([]);
                        return;
                    });
                });
            });
        })
    }

    getAllInternalOrders(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, issueDate, state, customerId FROM INTERNAL_ORDER';
            this.dao.dao.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrders = rows.map(row =>({
                    id: row.id,
                    issueDate:row.issueDate,
                    state: row.state,
                    customerId: row.customerId
                }))
                resolve(internalOrders)
                return;
            });
        });
    }

    getInternalOrdersState(state){
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, issueDate, state, customerId FROM INTERNAL_ORDER WHERE state=?';
            this.dao.dao.all(query, [state], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrders = rows.map(row =>({
                    id: row.id,
                    issueDate:row.issueDate,
                    state: row.state,
                    customerId: row.customerId
                }))
                resolve(internalOrders)
                return;
            });
        });
    }

    getProducts(id){
        return new Promise((resolve, reject) => {
            const query = 'SELECT productId, description, price, quantity FROM INTERNAL_ORDER_PRODUCT WHERE orderId=?';
            this.dao.dao.all(query, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const products = rows.map(row =>({
                    productId: row.productId,
                    description:row.description,
                    price: row.price,
                    quantity: row.quantity
                }))
                resolve(products)
                return;
            });
        });
    }

    getProductsRfid(orderId, productId){
        return new Promise((resolve, reject) => {
            const query = 'SELECT rfid FROM PRODUCT_RFID WHERE orderId=? AND productId=?';
            this.dao.dao.all(query, [orderId, productId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const products = rows.map(row =>({
                    rfid: row.rfid,
                }))
                resolve(products)
                return;
            });
        });
    }

    insertInternalOrder(order, products){
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO INTERNAL_ORDER (issueDate, state, customerId) VALUES (?, ?, ?) RETURNING id';
            this.dao.dao.all(query, [order.issueDate, "ISSUED", order.customerId], (err, rows) => {
                
                //console.log(rows);
                if (err) {
                    reject(err);
                    return;
                }
                const id = rows[0].id;
                {
                    const query2 = 'INSERT INTO INTERNAL_ORDER_PRODUCT (orderId, productId, quantity, description, price) VALUES (?, ?, ?, ?, ?)'
                    for (const p of products){
                        this.dao.dao.run(query2, [id, p.SKUId, p.qty, p.description, p.price], (err) =>{
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

    deleteInternalOrder(id){
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM INTERNAL_ORDER WHERE id=?';
            this.dao.dao.run(query, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                const query2 = 'DELETE FROM INTERNAL_ORDER_PRODUCT WHERE orderId=?'
                this.dao.dao.run(query2, [id], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const query3 = 'DELETE FROM PRODUCT_RFID WHERE orderId=?'
                    this.dao.dao.run(query3, [id], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                    })
                });
            });
            resolve(id);
            return;
        });
    }


    modifyInternalOrder(id, internalOrder){
        return new Promise((resolve, reject) => {
            const query = 'UPDATE INTERNAL_ORDER SET state = ? WHERE id=?';
            this.dao.dao.run(query, [internalOrder.state, id], (err, rows) => {

                if (err) {
                    reject(err);
                    return;
                }
                const query2 = 'INSERT INTO PRODUCT_RFID(orderId, productId, rfid) VALUES (?, ?, ?)';
                for (const p of internalOrder.products){
                    this.dao.dao.run(query2, [id, p.SkuID, p.RFID], (err)=>{
                        if(err){
                            reject(err);
                            return;
                        }
                    })
                }
            });


            resolve(0);
            return;
        });
    }

}

module.exports = internalOrderDAO;