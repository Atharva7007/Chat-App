const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "chat_app",
});

connection.connect((error) => {
  if (error) {
    console.log("An error occured while connecting to MySQL: ", error);
    return;
  }
  console.log("MySQL connection succesasful");
});

module.exports = connection;
