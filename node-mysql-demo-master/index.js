var mysql      = require('mysql');
var Promise = require('bluebird');
var colors = require('colors');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('The solution is: ', rows[0].solution);
// });

connection.queryAsync('SHOW DATABASES').then(
    function(result) {
        var rows = result[0];
        console.log("The databases in this mysql instance are: ", rows);
        return rows;
    }
).map(
    function(row) {
        return connection.queryAsync('SHOW TABLES FROM ' + row.Database).then(
            function(result) {
                var rows = result[0].map(function(tableRow) {
                    return tableRow['Tables_in_' + row.Database];
                });
                return {databaseName: row.Database, tableNames: rows};
            }
        );
    }
).then(
    function(mappedRows) {
        mappedRows.forEach(function(dbAndTables) {
            if (dbAndTables.tableNames.length) {
                console.log(dbAndTables.databaseName.bold + ": ");
                dbAndTables.tableNames.forEach(function(tableName) {
                    console.log("\t" + tableName.rainbow);
                });
            }
            else {
                console.log( (dbAndTables.databaseName + " does not have any tables").bold.red ); 
            }
        });
    }
).finally(
    function() {
        connection.end();
    }
);

// Array mapping example
// var myArray = [10, 15, 20];
// var myMappedArray = myArray.map(function(item) {
//     return item * 10;
// });

// console.log(myArray, myMappedArray);

// This is NOT real code
// var mappedRows = rows.map(function(row) {
//     return connection.query("SHOW TABLES FROM " + row.Database);
// });