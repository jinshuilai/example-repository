const db = require('../db');

module.exports = db.defineModel('Example', {
    category: db.STRING(50),
    tag: db.STRING(30),
    description: db.STRING(255),
    demo: db.TEXT
});