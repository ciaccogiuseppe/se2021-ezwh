const DAO = require('../DB/DAO.js')
const db = new DAO('./DB/ezwh.db');

module.exports = db;