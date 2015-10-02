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
var idArray;

function getEntry(startPos, endPosition){
    var whereIn = "";
    var endPos;
    if (endPosition) {
        endPos = endPosition;
    }
    else {
        endPos = startPos + 10;
    }
    for (var i = startPos; i < endPos; i++) {
        whereIn += idArray[i].id + ",";
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
        return proceed(endPos);
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
            else if ((idArrayPos + 9) <=  totalEntries) {
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
            console.log(totalEntries);
        }
    ).then(
        function(){
            connection.queryAsync("SELECT id FROM Account ORDER BY id ASC").then(
            function(results){
                idArray = results[0];
                return idArray;
            }).then(
                function(ids){
                console.log("Which position would you like to start at?");
                return prompt.getAsync("start").then(
                    function(input) {
                        var start = Number(input.start) - 1;
                        if (isNaN(input.start) || (Number(input.start) > totalEntries) || (Number(input.start) < 1)) {
                            return getEntry(0);
                        }
                        else if ((Number(input.start)) > (totalEntries - 10)) {
                            return getEntry(start, totalEntries);
                        }
                        else {
                            return getEntry(start);
                        }
                }
            );
        }
        
   );
        }
    );
}


start();