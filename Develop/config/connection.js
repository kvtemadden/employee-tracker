const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  }
);

module.exports = sequelize;

const mysql = require("mysql");
var connection = mysql.createConnection({
	// Connection
	host: "localhost",
	port: 3306,
	// MySQL Workbench
	user: "root",
	password: "",
	// Database
	database: "employee_trackerdb",
});

// connect to the mysql server and database
connection.connect(function (err) {
	if (err) throw err;
});

module.exports = connection;