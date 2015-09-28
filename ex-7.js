var mysql = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

connection.queryAsync("SELECT Account.id AS AccountId, Account.email AS AccountEmail, Account.password AS AccountPassword, Account.createdON AS AccountCreatedOn, Account.modifiedOn AS AccountModifiedOn, AddressBook.* FROM Account JOIN AddressBook ON AddressBook.accountId = Account.id").then(
    function(results) {
    	var rows = results[0];
    	console.log(rows)
    }
).finally(
    function() {
        connection.end();
    }
);