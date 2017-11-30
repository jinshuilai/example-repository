const db = require('../db');

module.exports = db.defineModel('Category', {
    name: db.STRING(50),
    sort: {
    	type: db.INTEGER,
    	allowNull: true
    }
});