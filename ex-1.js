var mysql = require('mysql');
var Table = require('cli-table');
var Promise = require('bluebird');
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
    function(results) {
    	var databases = results[0];
    	return databases;
    }
).then(
  function(databaseList) { 
    var table = new Table({head: ["DATABSES".red]})
    for (var row in databaseList) {
      table.push([databaseList[row].Database.rainbow]);
    }
    console.log(table.toString());
    }
).finally(
    function() {
      connection.end();
    }
);