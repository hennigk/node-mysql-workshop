var mysql      = require('mysql');
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

connection.queryAsync('SELECT * FROM Account LIMIT 10').then(
    function(accountResults) {
        return accountResults[0]; // rows from mysql
    }
)
.map(
    function(accountResult) {
        return connection.queryAsync("SELECT * FROM AddressBook WHERE accountId = " + accountResult.id).then(
            function(abResults) {
                accountResult.addressBooks = abResults[0];
                return accountResult;
            }
        );
    }
)
.then(
    function(accountsWithAddressBooks) {
        console.log(require('util').inspect(accountsWithAddressBooks, true, 10));
    }
)
.finally(
    function() {
        connection.end();
    }
);