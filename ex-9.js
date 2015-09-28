var mysql = require('mysql');
var Promise = require('bluebird');
var colors = require('colors');
var prompt = require('prompt');
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

var totalEntries
//display 10 entries
//ask user if they want more - prompt
//recall function
//compare last entry id with count
//where in - send 
//perform function to store a variable with the count number
//function to end

function getEntry(endNum){
    var whereIn = "";
    var start = endNum - 9;
    for (var i=start; i <=endNum; i++) {
        whereIn += i + ",";
    }
    connection.queryAsync("SELECT id, email FROM Account WHERE id IN (" + whereIn.substring(0, whereIn.length-1) + ") ORDER BY id ASC")
    .then(
        function(accounts) {
    	    return accounts[0];
    }
    ).then(
        function(rows) {
            var id;
            for (var i=0; i < rows.length; i++) {
                if (rows[i].id < 10) {
                    id = "  #" + rows[i].id + ": ";
                }
                if (rows[i].id > 10 && rows[i].id < 100) {
                    id = "  #" + rows[i].id + ": ";
                }
                else {
                    id = "#" + rows[i].id + ": ";
                }
                console.log(id.bold.black + rows[i].email.cyan);
            }
        return proceed(rows[9].id);
        }
    )
}



function proceed(endNum){
    console.log("Would you like to display Next 10 Results?\nenter 'no' to exit");
    return prompt.getAsync("continue").then(
        function(message){
            if (message.continue.toLowerCase() === "no" ) {
                console.log("Goodbye");
                end();
            }
            else if ((endNum + 10) <  totalEntries) {
                return getEntry(endNum + 10);
            }
            else {
               end(); 
            }
        }
    );
}

function start() {
    connection.queryAsync("SELECT COUNT (*) FROM Account").then(
        function(results){
            totalEntries = results[0][0]["COUNT (*)"];
        }
    ).then(
        getEntry(10) 
   );
}

function end(){
    connection.end();
}

start();