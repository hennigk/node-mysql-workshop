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
).then(
    function(rows) {
        var id;
        for (var i=0; i < rows.length; i++) {
            if (rows[i].id < 10) {
                id = " #" + rows[i].id + ": ";
            }
            else {
                id = "#" + rows[i].id + ": ";
            }
        console.log(id.bold.black + rows[i].email);
        }
    }
).finally(
    function() {
        connection.end();
    }
);
