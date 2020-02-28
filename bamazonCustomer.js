// bamazonCustomer.js
//-----------------------------------------------------------------

// Set Max Listeners value
//-----------------------------------------------------------------
require('events').EventEmitter.defaultMaxListeners = 50;

// Node Package Managers (NPM)
//-----------------------------------------------------------------
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

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

// Connect to the MySQL server and SQL database
//-----------------------------------------------------------------
connection.connect(function (err) {
    if (err) {
        return console.log('error:' + err.message);
    }
    // console.log("connected as id " + connection.threadId);
});

function numberWithCommas(string) {
    var parts = string.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

// wait() function
//-----------------------------------------------------------------

async function wait() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    mainMenu();
}

// viewProducts() function
//-----------------------------------------------------------------

function viewProducts() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM product ORDER BY item_id", function (err, result, fields) {
        if (err) {
            return console.log('error:' + err.message);
        }
        var resultsTable = new Table({
            head: ['ID', 'Product', 'Price', 'Stock']
        });

        for (i = 0; i < result.length; i++) {
            resultsTable.push([result[i].item_id, result[i].product_name, numberWithCommas(result[i].price), result[i].stock_quantity])
        };
        console.log(resultsTable.toString());
    });
    wait();
}

// purchaseProducts() function
//-----------------------------------------------------------------
function purchaseProducts() {
    console.log("-----------------Purchase Products-----------------")
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the ID of the product that you would like to purchase?",
                name: "item_id",
                validate: function (value) {
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
                validate: function (value) {
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
            connection.query("SELECT item_id,product_name,price,stock_quantity,sales FROM product WHERE item_id=?", [pid], function (err, results, fields) {
                if (err) {
                    return console.log('error:' + err.message);
                }
                if (results[0].stock_quantity > qty) {
                    var remaining = results[0].stock_quantity - qty;
                    var total = results[0].price * qty;
                    var formatTotal = numberWithCommas(total.toFixed(2));
                    var sales = results[0].sales + parseInt(formatTotal);
                    connection.query("UPDATE product SET ? WHERE ?",
                        [
                            {
                                stock_quantity: remaining,
                                sales: sales
                            },
                            {
                                item_id: pid
                            }
                        ],
                        function (err, res) {
                            if (err) throw err;
                        }
                    );
                    console.log(" ");
                    console.log("------------------------------------------------------------------------------------");
                    console.log(" Thank you! You purchased " + qty + " " + results[0].product_name + "(s) at a cost of $" + formatTotal + ".");
                    console.log(" Your product(s) will arrive within 5 days.");
                    console.log("------------------------------------------------------------------------------------");
                    console.log(" ");;
                } else {
                    console.log(" ");
                    console.log("------------------------------------------------------------------------------------");
                    console.log(" Sorry, we do not have enough " + results[0].product_name + "(s) in stock to purchase that quantity.");
                    console.log("------------------------------------------------------------------------------------");
                    console.log(" ");
                };
            });
            wait();
        });
}

// mainMenu() function
//-----------------------------------------------------------------
function mainMenu() {
    console.log("-----------------Welcome to MyStore-----------------")
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Purchase products",
                "View available products",
                new inquirer.Separator(),
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Purchase products":
                    purchaseProducts();
                    break;
                case "View available products":
                    viewProducts();
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
    console.log(" ");
    console.log("---------------------------------Thank you for visiting MyStore!---------------------------------");
    console.log(" ");
    connection.end();
    process.exit(0);
}
console.clear();
viewProducts();