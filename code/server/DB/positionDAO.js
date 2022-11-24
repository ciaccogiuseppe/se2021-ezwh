const Promise = require("bluebird");

class positionDAO {
    constructor(dao) {
        this.dao = dao;
    }
    /*createSKU(sku){

    }*/

    clear(){
        return new Promise((resolve,reject) => {
            const query = 'DELETE FROM POSITION';
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

    createPosition(pos) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO POSITION(positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) VALUES(?, ?, ?, ?, ?, ?, ?, ?) ';
            this.dao.dao.run(query, [pos.positionID, pos.aisleID, pos.row, pos.col, pos.maxWeight, pos.maxVolume, 0, 0], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Inserted Position');
                resolve(0);
                return;
            });
            
        });
    }

    getAllPositions(){
        return new Promise((resolve, reject) => {
            const query = 'SELECT positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume FROM POSITION';
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

    updatePositionID(oldPos, newPos){
        //console.log(oldPos);
        return new Promise((resolve, reject) => {
            const query = 'SELECT positionID FROM POSITION WHERE positionID=?';
            this.dao.dao.all(query, [oldPos], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if(rows.length > 0){
                    const query2 = 'UPDATE POSITION SET positionID = ?, aisleID = ?, row = ?, col = ? WHERE positionID = ?'
                    this.dao.dao.run(query2, [
                        newPos, 
                        newPos.substring(0,4),
                        newPos.substring(4,8),
                        newPos.substring(8,12),
                        oldPos
                    ], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        //console.log('Updated Position');
                        
                    });
                }
                
                resolve(rows.length)
                return;
            });
        });
    }

    updateOccupiedPosition(positionID, occupiedVolume, occupiedWeight){
        return new Promise((resolve, reject) => {
            const query = 'SELECT positionID FROM POSITION WHERE positionID=?';
            this.dao.dao.all(query, [positionID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if(rows.length > 0){
                    const query2 = 'UPDATE POSITION SET occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?'
                    this.dao.dao.run(query2, [
                        occupiedWeight,
                        occupiedVolume,
                        positionID
                    ], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        //console.log('Updated Position');
                        
                    });
                }
                
                resolve(rows.length)
                return;
            });
        });
    }

    updatePosition(positionID, newData){
        
        return new Promise((resolve, reject) => {
            const query = 'SELECT positionID FROM POSITION WHERE positionID=?';
            this.dao.dao.all(query, [positionID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log(rows);
                if(rows.length > 0){
                    const query2 = 'UPDATE POSITION SET positionID = ?, aisleID = ?, row = ?, col = ?, maxWeight = ?, maxVolume = ?, occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?'
                    this.dao.dao.run(query2, [
                        newData.aisleID + newData.row + newData.col,
                        newData.aisleID,
                        newData.row,
                        newData.col,
                        newData.maxWeight,
                        newData.maxVolume,
                        newData.occupiedWeight,
                        newData.occupiedVolume,
                        positionID
                    ], (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        //console.log('Updated Position');
                        
                    });
                }
                
                resolve(rows.length)
                return;
            });
        });
    }


    deletePosition(id){
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM POSITION WHERE positionID=?';
            this.dao.dao.run(query, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                //console.log('Deleted Position ' + id);
                resolve(id);
                return;
            });
        });
    }
}

module.exports = positionDAO;