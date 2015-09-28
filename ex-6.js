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

connection.queryAsync("SELECT * FROM Account LIMIT 10")
.then(
    function(accounts) {
    	return accounts[0];
    }
)
.then(
    function(accounts){
        var accountIds = "";
        for (var i = 0; i < accounts.length; i++) {
            accountIds+= accounts[i].id.toString() +",";
        }
        return (accountIds.substring(0, accountIds.length-1))
    }
).then(
    function(accountIds) {
        return (connection.queryAsync("SELECT Account.email, AddressBook.id, AddressBook.accountId, AddressBook.name FROM Account JOIN AddressBook ON AddressBook.accountId = Account.id WHERE accountId IN (" + accountIds + ") ORDER BY AddressBook.accountId"));
    }
).then(
    function(billionAccounts){
        var idHolder = billionAccounts[0][0].accountId
        var id = ""
        var row = "";
        for (var i = 0; i < billionAccounts[0].length; i++) {
            if (billionAccounts[0][i].accountId === idHolder) {
                id = ("#" + billionAccounts[0][i]["accountId"] + ": " + billionAccounts[0][i].email + "\n");
                row += ("    #" + billionAccounts[0][i].id + ": "  + billionAccounts[0][i].name + "\n")
            }
            else {
                console.log(id + row)
                row = "";
                idHolder = billionAccounts[0][i].accountId
            }
        }
        console.log(id + row)
    }
).finally(
    function() {
        connection.end();
    }
);