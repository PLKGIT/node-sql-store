// bamazonCustomer.js
//-----------------------------------------------------------------
//-----------------------------------------------------------------

// Set Max Listeners value
//-----------------------------------------------------------------
require('events').EventEmitter.defaultMaxListeners = 50;

// Node Package Managers (NPM)
//-----------------------------------------------------------------
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var fs = require('fs');

var resultsTable = new Table({
    head: ['ID', 'Product', 'Price', 'Stock']
});

// Create SQL Database Connection
//-----------------------------------------------------------------
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_DB",
    debug: false
});

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

// wait() function
//-----------------------------------------------------------------

async function wait() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    mainMenu();
}

// readProducts() function
//-----------------------------------------------------------------

function readProducts() {
    // Connect to the MySQL server and SQL database
    //-----------------------------------------------------------------
    connection.connect(function (err) {
        if (err) {
            return console.log('error:' + err.message);
        }
        // console.log("connected as id " + connection.threadId);
    });

    connection.query("SELECT item_id, product_name, price, stock_quantity FROM product ORDER BY item_id", function (err, result, fields) {
        if (err) {
            return console.log('error:' + err.message);
        }

        for (i = 0; i < result.length; i++) {
            resultsTable.push([result[i].item_id, result[i].product_name, result[i].price, result[i].stock_quantity])
        };
        console.log(resultsTable.toString());
    });
    wait();
}

// purchaseProducts() function
//-----------------------------------------------------------------
function purchaseProducts() {
    console.clear();
    console.log("-----------------Purchase Products-----------------")
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID of the product that you would like to purchase?",
                name: "item_id",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                }
            },
            {
                type: "input",
                message: "How many would you like to purchase?",
                name: "stock",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var pid = answer.item_id;
            var qty = answer.stock;
            connection.query("SELECT item_id,product_name,price,stock_quantity FROM product WHERE item_id=?", [pid], function (err, results, fields) {
                if (err) {
                    return console.log('error:' + err.message);
                }
                if (results[0].stock_quantity > qty) {
                    var remaining = results[0].stock_quantity - qty;
                    var total = results[0].price * qty;
                    var formatTotal = numberWithCommas(total.toFixed(2));
                    connection.query("UPDATE product SET ? WHERE ?",
                        [
                            {
                                stock_quantity: remaining
                            },
                            {
                                item_id: pid
                            }
                        ],
                        function (err, res) {
                            if (err) throw err;
                        }
                    );
                    console.clear();
                    console.log("------------------------------------------------------------------------------------");
                    console.log("| Thank you! You purchased " + qty + " " + results[0].product_name + "(s) at a cost of $" + formatTotal + ".");
                    console.log("------------------------------------------------------------------------------------");
                    connection.end();
                } else {
                    console.clear();
                    console.log("------------------------------------------------------------------------------------");
                    console.log("| Sorry, we do not have enough " + results[0].product_name + "(s) in stock to purchase that quantity.");
                    console.log("------------------------------------------------------------------------------------");
                    connection.end();
                };
            });
        });
}


// mainMenu() function
//-----------------------------------------------------------------
function mainMenu() {
    console.log("-----------------MyStore-----------------")
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Purchase products",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Purchase products":
                    purchaseProducts();
                    break;
                case "Exit":
                    console.clear();
                    exit();
                    break;
            }
        });
}


// exit() function
//-----------------------------------------------------------------
function exit() {
    console.clear();
    console.log("---------------------------------Thank you for visiting!---------------------------------");
    process.exit(0);
}

readProducts();