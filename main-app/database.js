const mysql = require('mysql')

const mysqlConnector = mysql.createConnection({
    host: "localhost",
    user: "gauravghati",
    password: "password",
    database: "queportal",
    multipleStatements: true
});

mysqlConnector.connect((err)=>{
    if(!err){
        
        console.log('Connected');
    } else {
        console.log(err)
        console.log('Connection Fail');
    }
});

module.exports = mysqlConnector;