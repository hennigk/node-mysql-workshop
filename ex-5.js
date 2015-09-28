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
.map(
    function(accounts){
        return (connection.queryAsync("SELECT id, accountId, name FROM AddressBook WHERE accountId = " + accounts.id));
    }
).then(
    function(billionAccounts){
        for (var i = 0; i < billionAccounts.length; i++) {
            var row = "";
            var id = "";
            for (var j=0; j < billionAccounts[i][0].length; j++) {
                id = ("Account #" + billionAccounts[i][0][j]["accountId"] + "\n");
                row += ("#" + billionAccounts[i][0][j].id + ": " + billionAccounts[i][0][j].name + "\n");
            }
            console.log(id + row);
        }
    }
).finally(
    function() {
        connection.end();
    }
);