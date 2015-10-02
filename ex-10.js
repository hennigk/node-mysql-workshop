var mysql = require('mysql');
var Promise = require('bluebird');
var prompt = require("prompt");
Promise.promisifyAll(prompt);
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});


function getEntry(){
    var newEntry = new Object;
    console.log("enter new account information");
    return prompt.getAsync("email")
    .then(
        function(results){
            newEntry["email"] = results.email;
        }
    ).then(
        function(){
            return prompt.getAsync("password");
        }
    ).then(
        function(results){
            newEntry["password"] = results.password;
        }
    ).then(
        function(){
            return prompt.getAsync("confirmPassword");
        }
    ).then(
        function(results){
            if (results.confirmPassword !== newEntry.password) {
                console.log("passwords do not match \n try again");
                getEntry();
            }
            else {
                return newEntry;
            }
        }
    );
}


getEntry().then(
    function(entry){
        var keys = Object.keys(entry);
        var values = "";
        var createDate = new Date();
        createDate = createDate.toISOString();
        var sqlDate = (createDate.replace("T", " ")).substr(0, createDate.length - 5);
        for (var key in entry) {
            values += "'" + entry[key] + "',";
        }
        connection.queryAsync("INSERT INTO Account (" + keys.toString() + ",createdOn, modifiedOn) VALUES (" + values.substr(0, values.length - 1) + ",'" + sqlDate + "','" + sqlDate + "')" )
        .then(
            function(results){
                console.log("\nAccount #" + results[0].insertId + " Sucessfully Created \n");
                return connection.queryAsync("SELECT * FROM Account WHERE id=" + results[0].insertId);
            }
        ).then(
            function(entry){
                console.log(entry[0][0]);
            }
        ).finally(
            function() {
                connection.end();
            }
        );
    }
);

