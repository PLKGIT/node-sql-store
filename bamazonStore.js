// bamazonStore.js
//-----------------------------------------------------------------
//-----------------------------------------------------------------

// Set Max Listeners value
//-----------------------------------------------------------------
require('events').EventEmitter.defaultMaxListeners = 50;

// Required Files
//-----------------------------------------------------------------
var Customer = require("./javascript/bamazonCustomer");
var Manager = require("./javascript/bamazonManager");

// Node Package Managers (NPM)
//-----------------------------------------------------------------
var inquirer = require("inquirer");
var table = require("table");
var mysql = require("mysql");
var fs = require('fs');

// Create SQL Database Connection
//-----------------------------------------------------------------
var connection = mysql.createConnection({
    host: "localhost",

    // Port
    port: 3306,

    // Username
    user: "root",

    // Password
    password: "root",

    // Database
    database: "bamazon_DB"
});

// Connect to the MySQL server and SQL database
//-----------------------------------------------------------------
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    mainMenu();
});

// mainMenu() function
//-----------------------------------------------------------------
function mainMenu() {
    console.clear();
    console.log("---------MY STORE--------")
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Customer or Employee?",
            choices: [
                "Customer",
                "Employee",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Customer":
                    storeCustomer();
                    break;

                case "Employee":
                    storeEmployee();
                    break;

                case "Exit":
                    exit();
                    break;
            }
        });
}

// storeCustomer() function
//-----------------------------------------------------------------
function storeCustomer() {
    console.clear();
    console.log("---------CUSTOMERS--------")
    mainMenu()
}

// storeEmployee() function
//-----------------------------------------------------------------
function storeEmployee() {
    console.clear();
    console.log("---------EMPLOYEES--------")
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Manager or Supervisor?",
            choices: [
                "Manager",
                "Supervisor",
                "Main Menu"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Manager":
                    storeManager();
                    break;

                case "Supervisor":
                    storeSupervisor();
                    break;

                case "Main Menu":
                    mainMenu();
                    break;
            }
        });
}

// storeManager() function
//-----------------------------------------------------------------
function storeManager() {
    console.clear();
    console.log("Hello Store Manager");
    mainMenu()
}

// storeSupervisor() function
//-----------------------------------------------------------------
function storeSupervisor() {
    console.clear();
    console.log("Hello Store Supervisor");
    mainMenu()
}

// exit() function
//-----------------------------------------------------------------
function exit() {
    connection.end();
    process.exit(0);
}