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

connection.queryAsync("SELECT * FROM Account ORDER BY Account.id ASC LIMIT 10")
.then(
    function(results) {
    	var rows = results[0];
    	return rows
    }
).map(
    function(rows){
        return connection.queryAsync("SELECT Account.id, Account.email, AddressBook.id AS AddressBook_ID, AddressBook.name FROM Account JOIN AddressBook ON AddressBook.accountId = Account.id WHERE AddressBook.accountId =" + rows.id + " ORDER BY AddressBook.id LIMIT 1")
    }
).map(
    function(rows){
        return connection.queryAsync("SELECT Account.id, Account.email,\
        AddressBook.id AS AddressBook_ID, AddressBook.name, \
        Entry.firstName, Entry.lastName, Entry.id AS Entry_ID \
        FROM Account JOIN AddressBook ON AddressBook.accountId = Account.id \
        JOIN Entry ON Entry.addressBookId = AddressBook.id \
        WHERE Entry.AddressBookId =" + rows[0][0].AddressBook_ID + "\
        ORDER BY Entry.id LIMIT 10");
    }
).then(
    function(data){
        for (var i = 0; i < data.length; i++) {
            if (data[i][0][0]) {
                console.log(("\n#" + data[i][0][0].id).rainbow + ": " + data[i][0][0].email);
                console.log("   Address Book " + ("#" + data[i][0][0].AddressBook_ID).green + ": " + data[i][0][0].name);
            }
            for(var j = 0; j<data[i][0].length; j++) {
                console.log("      Entry " + ("#" + data[i][0][j].Entry_ID).yellow + ": " + data[i][0][j].firstName + " " + data[i][0][j].lastName);
            }
        }   
    }
).finally(
    function() {
        connection.end();
    }
);
