var mysql = require('mysql');

var con = mysql.createConnection({
  host: "hvr-save-data-hvrsave.d.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_IcjmrPjcsbuhP4OZY8E",
  database: "hvr_data",
  port: 10002
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});