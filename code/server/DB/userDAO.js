const Promise = require("bluebird");

class userDAO {
    constructor(dao) {
        this.dao = dao;
    }

    clear(){
        return new Promise((resolve,reject) => {
            const query = 'DELETE FROM USER';
            this.dao.dao.run(query, [], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve([]);
            });
        })
    }

    createUser(user) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO USER(email, name, surname, password, type) VALUES(?, ?, ?, ?, ?) RETURNING id';
            this.dao.dao.get(query, [user.username, user.name, user.surname, user.password, user.type], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows.id)
            });
        });
    }

    getAllUsers() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, name, surname, type, email FROM USER WHERE type != "manager"';
            this.dao.dao.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            });
        });
    }

    getSuppliers() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, name, surname, email FROM USER WHERE type = "supplier"';
            this.dao.dao.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            });
        });
    }

    getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, email, name, surname, type FROM USER WHERE id = ?';
            this.dao.dao.all(query, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            });
        });
    }

    getUserByUsernameAndType(email, type) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM USER WHERE email = ? AND type = ?';
            this.dao.dao.all(query, [email, type], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            });
        });
    }

    updateUserRights(email, oldType, newType) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE USER SET type = ? WHERE email = ? AND type = ?';
            this.dao.dao.run(query, [newType, email, oldType], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(0)
            });
        });

    }

    login(type, email, password) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, email, name, surname FROM USER WHERE email = ? AND type = ? AND password = ?';
            this.dao.dao.get(query, [email, type, password], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
                return;
            });
        });
    }

    deleteUser(email, type) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM USER WHERE email = ? AND type = ? RETURNING id';
            this.dao.dao.get(query, [email, type], (err,row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }
}

module.exports = userDAO;