var mysql = require('mysql');

var con = mysql.createConnection({
  host: "sql6.freesqldatabase.com",
  user: "sql6697602",
  password: "AMv1vQGNZ1",
  database: "sql6697602"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});