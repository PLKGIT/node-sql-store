// bamazonStore.js
//-----------------------------------------------------------------
//-----------------------------------------------------------------

// Set Max Listeners value
//-----------------------------------------------------------------
require('events').EventEmitter.defaultMaxListeners = 50;

// Required Files
//-----------------------------------------------------------------
var Customer = require("./bamazonCustomer");
var Manager = require("./bamazonManager");

// Node Package Managers (NPM)
//-----------------------------------------------------------------
var inquirer = require("inquirer");
var Table = require('cli-table');
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

function readProducts() {
    connection.query("SELECT product_name, price FROM product ORDER BY price", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['Product', 'Price']
        });

        for (i = 0; i < res.length; i++) {
            table.push([res[i].product_name, res[i].price])
        };
        console.log(table.toString());
        connection.end();
    });
}

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
    connection.query("SELECT product_name, price FROM product ORDER BY price", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['Product', 'Price']
        });

        for (i = 0; i < res.length; i++) {
            table.push([res[i].product_name, res[i].price])
        };
        console.log(table.toString());
    });
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID of the product that you would like to purchase?",
                name: "product_id"
            },
            {
                type: "input",
                message: "How many would you like to purchase?",
                name: "stock_quantity"
            }
        ])
        .then(function (answer) {
            var pid = answer.product_id;
            console.log(pid);
            var qty = answer.stock_quantity;
            console.log(qty);

            var query = connection.query(
                "SELECT * FROM product WHERE item_id=?", [pid],function (err, res) {
                    if (err) throw err;
                    console.log(res);
                    console.log(res.RowDataPacket.stock_quantity);

                    if (res.stock_quantity > qty){
                        console.log("purchase ok");
                    } else {
                        console.log("sorry, not enough stock");
                    };
                }

            );

           
            // logs the actual query being run
            console.log("Got it!");
            connection.end();
        });

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