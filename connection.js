
const mysql = require('mysql2');
console.log('Connecting to MySQL...');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});

module.exports = connection;
