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

connection.queryAsync("SELECT Account.id AS AccountId, Account.email AS AccountEmail, Account.password AS AccountPassword, Account.createdON AS AccountCreatedOn, Account.modifiedOn AS AccountModifiedOn, AddressBook.* FROM Account JOIN AddressBook ON AddressBook.accountId = Account.id ORDER BY Account.id")
.then(
    function(results) {
    	var data = results[0];
    	return(data)
    }
).then(
    function(rows){
        var idHolder = rows[0].AccountId;
        var id = ""
        var row = "";
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].accountId === idHolder) {
                id = ("#" + rows[i]["AccountId"] + ": " + rows[i].AccountEmail + "\n");
                row += ("    -"+ rows[i].name + "\n")
            }
            else {
                console.log(id + row)
                row = "";
                idHolder = rows[i].AccountId
            }
        }
        console.log(id + row)
    }
).finally(
    function() {
        connection.end();
    }
);