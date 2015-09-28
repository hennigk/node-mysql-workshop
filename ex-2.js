var mysql = require('mysql');
var Promise = require('bluebird');
var Table = require('cli-table');
var colors = require('colors');

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : ''
});

connection.queryAsync("SHOW DATABASES").then(
    function(databaseList) {
    	var databases = databaseList[0];
    	return databases
    }
).map(
    function(databases) {
        return getTables(databases)
    }
).then(
    function(tableList){
        var table = new Table({ head: ["Database", "Table Names"] });
        for (var i =0; i<tableList.length; i++) {
            table.push([tableList[i][0], tableList[i][1]]);
        }
        console.log(table.toString());
    }
).finally(
    function() {
        connection.end();
    }
);

function getTables(databaseName){
    connection.changeUser({database : databaseName.Database})
    return connection.queryAsync("SHOW TABLES").then(
        function(tables){
            var tableArray = "";
            for (var i = 0; i < tables[0].length; i++) {
                for (var key in tables[0][i]) {
                    var tableName = tables[0][i][key].toString()
                    tableArray+=(tableName+"\n").rainbow;
                }
            }
            return [databaseName.Database.blue, tableArray];
        }
    );
}