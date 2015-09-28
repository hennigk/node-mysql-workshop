var mysql = require('mysql');
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

connection.queryAsync("SELECT id, email FROM Account LIMIT 10").then(
    function(accounts) {
    	return accounts[0];
    }
).map(
    function(rows) {
        var id;
        if (rows.id < 10) {
            id = " #" + rows.id + ": ";
        }
        else {
            id = "#" + rows.id + ": ";
        }
        console.log(id.bold.black + rows.email);
    }
).finally(
    function() {
        connection.end();
    }
);
