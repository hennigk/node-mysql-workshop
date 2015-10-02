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

var totalEntries;

function getEntry(startPos, offset){
    var whereIn = "";
    var endrow = 10;
    if (offset) {
        endrow = offset;
    }
    // for (var i = startPos; i < endPos; i++) {
    //     whereIn += idArray[i].id + ",";
    // }
    connection.queryAsync("SELECT id, email FROM Account ORDER BY id ASC LIMIT " + startPos + ", " + endrow)
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
                else if (rows[i].id >= 10 && rows[i].id < 100) {
                    id = " #" + rows[i].id + ": ";
                }
                else {
                    id = "#" + rows[i].id + ": ";
                }
                console.log(id.bold.black + rows[i].email.cyan);
            }
        return proceed(startPos + endrow);
        }
    );
}

function proceed(idArrayPos){
    console.log("Would you like to display Next 10 Results?\nenter 'no' to exit");
    return prompt.getAsync("continue").then(
        function(message){
            if (message.continue.toLowerCase() === "no" ) {
                console.log("Goodbye");
                end();
            }
            else if ((idArrayPos + 10) <=  totalEntries) {
                return getEntry(idArrayPos);
            }
            else if ((idArrayPos) <  totalEntries) {
                return getEntry(idArrayPos, totalEntries);
            }
            else {
               console.log("no more entries to display");
               end(); 
            }
        }
    );
}


function end(){
    connection.end();
}


function start() {
    connection.queryAsync("SELECT COUNT (*) FROM Account").then(
        function(results){
            totalEntries = results[0][0]["COUNT (*)"];
        }
    ).then(
        function(){
        console.log("Which row would you like to start at?");
        return prompt.getAsync("start").then(
            function(input) {
                var start = Number(input.start) - 1;
                if (isNaN(input.start) || (Number(input.start) > totalEntries) || (Number(input.start) < 1)) {
                    return getEntry(0);
                }
                else if ((Number(input.start)) > (totalEntries - 10)) {
                    var offset = totalEntries - start;
                    return getEntry(start, offset);
                }
                else {
                    return getEntry(start);
                }
                }
            );
        }
        
   );
}


start();