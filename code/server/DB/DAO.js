
const Promise = require('bluebird')

class DAO {
    sqlite = require('sqlite3');

    constructor(dbname) {
        this.dao = new this.sqlite.Database(dbname, (error) => {
            if (error) {
                console.log('Could not connect to database', error);
                throw error;
            } else {
                console.log('Connected to database');
            }
        });
    }


    /*testConfig = function(){
        

        const query0 = `DROP TABLE IF EXISTS INTERNAL_ORDER;`
        const query1 = `DROP TABLE IF EXISTS INTERNAL_ORDER_PRODUCT;`
        const query2 = `DROP TABLE IF EXISTS ITEM;`
        const query3 =  `DROP TABLE IF EXISTS POSITION;`
        const query4 = `DROP TABLE IF EXISTS PRODUCT_RFID;`
        const query5 = `DROP TABLE IF EXISTS RESTOCK_ORDER;`
        const query6 = `DROP TABLE IF EXISTS RESTOCK_ORDER_PRODUCT;`
        const query7 = `DROP TABLE IF EXISTS RESTOCK_ORDER_PRODUCT_RFID;`
        const query8 = `DROP TABLE IF EXISTS RETURN_ORDER;`
        const query9 = `DROP TABLE IF EXISTS RETURN_ORDER_PRODUCT;`
        const query10 = `DROP TABLE IF EXISTS SKU;`
        const query11 = `DROP TABLE IF EXISTS SKU_Item;`
        const query12 = `DROP TABLE IF EXISTS SKU_TESTDESCRIPTORS;`
        const query13 = `DROP TABLE IF EXISTS TESTRESULT;`
        const query14 = `DROP TABLE IF EXISTS TRANSPORT_NOTE;`
        const query15 = `DROP TABLE IF EXISTS USER;`

        const query16 = `CREATE TABLE "INTERNAL_ORDER" (
            "id"	INTEGER NOT NULL,
            "issueDate"	TEXT,
            "state"	TEXT NOT NULL,
            "customerId"	INTEGER NOT NULL,
            PRIMARY KEY("id")
        );`
                
        const query17 = `CREATE TABLE "INTERNAL_ORDER_PRODUCT" (
            "orderId"	INTEGER NOT NULL,
            "productId"	INTEGER NOT NULL,
            "quantity"	INTEGER NOT NULL,
            "description"	TEXT,
            "price"	REAL NOT NULL,
            PRIMARY KEY("productId","orderId")
        );`
        
        const query18 = `CREATE TABLE "ITEM" (
            "id"	INTEGER NOT NULL UNIQUE,
            "description"	TEXT NOT NULL,
            "price"	INTEGER NOT NULL,
            "SKUId"	INTEGER,
            "supplierId"	INTEGER NOT NULL,
            PRIMARY KEY("id")
        );`
                
        const query19 = `CREATE TABLE "POSITION" (
            "positionID"	TEXT NOT NULL,
            "aisleID"	TEXT NOT NULL,
            "row"	TEXT NOT NULL,
            "col"	TEXT NOT NULL,
            "maxWeight"	INTEGER NOT NULL,
            "maxVolume"	INTEGER NOT NULL,
            "occupiedWeight"	INTEGER,
            "occupiedVolume"	INTEGER,
            PRIMARY KEY("positionID")
        );`
                
        const query20 = `CREATE TABLE "PRODUCT_RFID" (
            "orderId"	INTEGER NOT NULL,
            "productId"	INTEGER NOT NULL,
            "rfid"	TEXT NOT NULL,
            PRIMARY KEY("rfid","productId","orderId")
        );`
                
        const query21 = `CREATE TABLE "RESTOCK_ORDER" (
            "id"	INTEGER NOT NULL,
            "issueDate"	TEXT,
            "state"	TEXT NOT NULL,
            "supplierId"	INTEGER NOT NULL,
            "transportNote"	INTEGER,
            PRIMARY KEY("id")
        );`
                
        const query22 = `CREATE TABLE "RESTOCK_ORDER_PRODUCT" (
            "orderId"	INTEGER NOT NULL,
            "productId"	INTEGER NOT NULL,
            "quantity"	INTEGER,
            "description"	TEXT,
            "price"	REAL NOT NULL,
            PRIMARY KEY("orderId","productId")
        );`
                
        const query23 = `CREATE TABLE "RESTOCK_ORDER_PRODUCT_RFID" (
            "orderId"	INTEGER NOT NULL,
            "productId"	INTEGER NOT NULL,
            "rfid"	TEXT NOT NULL,
            PRIMARY KEY("orderId","productId","rfid")
        );`
                
        const query24 = `CREATE TABLE "RETURN_ORDER" (
            "id"	INTEGER NOT NULL,
            "returnDate"	TEXT,
            "restockOrderId"	INTEGER NOT NULL,
            PRIMARY KEY("id")
        );`
                
        const query25 = `CREATE TABLE "RETURN_ORDER_PRODUCT" (
            "orderId"	INTEGER,
            "productId"	INTEGER,
            "description"	TEXT,
            "price"	REAL NOT NULL,
            "RFID"	TEXT NOT NULL,
            PRIMARY KEY("orderId","productId")
        );`
                
        const query26 = `CREATE TABLE "SKU" (
            "id"	INTEGER NOT NULL,
            "description"	TEXT NOT NULL,
            "weight"	INTEGER NOT NULL,
            "volume"	INTEGER NOT NULL,
            "notes"	TEXT,
            "position"	TEXT,
            "availableQuantity"	INTEGER NOT NULL,
            "price"	REAL NOT NULL,
            PRIMARY KEY("id")
        );`
                
        const query27 = `CREATE TABLE "SKU_Item" (
            "RFID"	TEXT NOT NULL UNIQUE,
            "SKUId"	INTEGER NOT NULL,
            "Available"	INTEGER NOT NULL,
            "DateOfStock"	TEXT,
            PRIMARY KEY("RFID")
        );`
                
        const query28 = `CREATE TABLE "SKU_TESTDESCRIPTORS" (
            "id"	INTEGER NOT NULL,
            "name"	TEXT NOT NULL,
            "procedureDescription"	TEXT,
            "idSKU"	INTEGER,
            PRIMARY KEY("id")
        );`
                
        const query29 = `CREATE TABLE "TESTRESULT" (
            "id"	INTEGER NOT NULL,
            "idTestDescriptor"	INTEGER NOT NULL,
            "Date"	TEXT NOT NULL,
            "Result"	TEXT NOT NULL,
            "RFID"	TEXT NOT NULL,
            PRIMARY KEY("id")
        );`
                
        const query30 = `CREATE TABLE "TRANSPORT_NOTE" (
            "id"	INTEGER NOT NULL,
            "deliveryDate"	TEXT NOT NULL,
            PRIMARY KEY("id")
        );`
                
        const query31 = `CREATE TABLE "USER" (
            "id"	INTEGER,
            "email"	TEXT NOT NULL UNIQUE,
            "name"	TEXT NOT NULL,
            "surname"	TEXT NOT NULL,
            "password"	TEXT NOT NULL,
            "type"	TEXT NOT NULL CHECK("TYPE" IN ("customer", "manager", "qualityEmployee", "clerk", "deliveryEmployee", "supplier")),
            PRIMARY KEY("id")
        );`
        
        const query32 = 'INSERT INTO USER (email, name, surname, password, type) VALUES (?, ?, ?, ?, ?)'


            return new Promise((resolve, reject) => {
                const db = this.dao;
                db.serialize(function() {
                    db.run(query0, function(err, row) {if (err) {reject(err); return}});
                    db.run(query1, function(err, row) {if (err) {reject(err); return}});
                    db.run(query2, function(err, row) {if (err) {reject(err); return}});
                    db.run(query3, function(err, row) {if (err) {reject(err); return}});
                    db.run(query4, function(err, row) {if (err) {reject(err); return}});
                    db.run(query5, function(err, row) {if (err) {reject(err); return}});
                    db.run(query6, function(err, row) {if (err) {reject(err); return}});
                    db.run(query7, function(err, row) {if (err) {reject(err); return}});
                    db.run(query8, function(err, row) {if (err) {reject(err); return}});
                    db.run(query9, function(err, row) {if (err) {reject(err); return}});
                    db.run(query10, function(err, row) {if (err) {reject(err); return}});
                    db.run(query11, function(err, row) {if (err) {reject(err); return}});
                    db.run(query12, function(err, row) {if (err) {reject(err); return}});
                    db.run(query13, function(err, row) {if (err) {reject(err); return}});
                    db.run(query14, function(err, row) {if (err) {reject(err); return}});
                    db.run(query15, function(err, row) {if (err) {reject(err); return}});
                    db.run(query16, function(err, row) {if (err) {reject(err); return}});
                    db.run(query17, function(err, row) {if (err) {reject(err); return}});
                    db.run(query18, function(err, row) {if (err) {reject(err); return}});
                    db.run(query19, function(err, row) {if (err) {reject(err); return}});
                    db.run(query20, function(err, row) {if (err) {reject(err); return}});
                    db.run(query21, function(err, row) {if (err) {reject(err); return}});
                    db.run(query22, function(err, row) {if (err) {reject(err); return}});
                    db.run(query23, function(err, row) {if (err) {reject(err); return}});
                    db.run(query24, function(err, row) {if (err) {reject(err); return}});
                    db.run(query25, function(err, row) {if (err) {reject(err); return}});
                    db.run(query26, function(err, row) {if (err) {reject(err); return}});
                    db.run(query27, function(err, row) {if (err) {reject(err); return}});
                    db.run(query28, function(err, row) {if (err) {reject(err); return}});
                    db.run(query29, function(err, row) {if (err) {reject(err); return}});
                    db.run(query30, function(err, row) {if (err) {reject(err); return}});
                    db.run(query31, function(err, row) {if (err) {reject(err); return}});
                    db.run(query32, ['user1@ezwh.com', 'name', 'surname', 'testpassword', 'customer'], function(err, row) {if (err) {reject(err); return}});
                    db.run(query32, ['qualityEmployee1@ezwh.com', 'name', 'surname', 'testpassword', 'qualityEmployee'], function(err, row) {if (err) {reject(err); return}});
                    db.run(query32, ['clerk1@ezwh.com', 'name', 'surname', 'testpassword', 'clerk'], function(err, row) {if (err) {reject(err); return}});
                    db.run(query32, ['deliveryEmployee1@ezwh.com', 'name', 'surname', 'testpassword', 'deliveryEmployee'], function(err, row) {if (err) {reject(err); return}});
                    db.run(query32, ['supplier1@ezwh.com', 'name', 'surname', 'testpassword', 'supplier'], function(err, row) {if (err) {reject(err); return}});
                    db.run(query32, ['manager1@ezwh.com', 'name', 'surname', 'testpassword', 'manager'], function(err, row) {if (err) {reject(err); return}});
                });
                resolve(0);
            });
        }*/
}
module.exports = DAO;