// bamazonManager.js
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

async function waitView() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    mainMenu();
}

async function waitAdd() {
    await new Promise(resolve => setTimeout(resolve, 20000));
    viewProducts();
}

async function waitUpdate() {
    await new Promise(resolve => setTimeout(resolve, 10000));
    viewProducts();
}

// isEmpty() function
//-----------------------------------------------------------------
function isEmpty(data) {
    for (var key in data) {
        if (data.hasOwnProperty(key))
            return false;
    }
    return true;
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
        console.clear();
        console.log(resultsTable.toString());
    });
    waitView();
}

// addProducts() function
//-----------------------------------------------------------------

function addProducts() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "Product name:"
            },
            {
                name: "department",
                type: "rawlist",
                message: "Department name:",
                choices: [
                    "Bedding",
                    "Clothing",
                    "Electronics",
                    "Furniture",
                    "Sports"
                ]
            },
            {
                name: "price",
                type: "number",
                message: "Product price:"
            },
            {
                name: "stock",
                type: "input",
                message: "Quantity:"
            }
        ])
        .then(function (answer) {
            var product_name = answer.product;
            var price = answer.price;
            var stock_quantity = answer.stock;
            var department_id=0;
            switch (answer.department) {
                case "Bedding":
                  department_id =1 ;
                  break;
                case "Clothing":
                  department_id = 2;
                  break;
                case "Electronics":
                  department_id = 3;
                  break;
                case "Furniture":
                  department_id = 4;
                  break;
                case "Sports":
                  department_id = 5;
                  break;
              }
        
            console.log("Adding " + product_name + "(s)...");
            connection.query("INSERT INTO product SET ?",
                {
                    product_name: product_name,
                    department_id: department_id,
                    price: price,
                    stock_quantity: stock_quantity,
                    sales: 0
                },

                function (err, result, fields) {
                    if (err) {
                        return console.log('error:' + err.message);
                    }

                });

            waitAdd();
        });

}

// viewLowInventory() function
//-----------------------------------------------------------------

function viewLowInventory() {
    connection.query("SELECT item_id, product_name, stock_quantity FROM product WHERE stock_quantity<5", function (err, result, fields) {
        if (err) {
            return console.log('error:' + err.message);
        }

        if (isEmpty(result)) {
            console.log(" ")
            console.log("------------------------------------------------------------------------------------");
            console.log("      There are no products with fewer than five (5) in inventory.")
            console.log("------------------------------------------------------------------------------------");
            console.log(" ")
        } else {
            var resultsTable = new Table({
                head: ['ID', 'Product', 'Stock']
            });

            for (i = 0; i < result.length; i++) {
                resultsTable.push([result[i].item_id, result[i].product_name, result[i].stock_quantity])
            };
            console.clear();
            console.log(resultsTable.toString());
        }
    });
    waitView();
}

// addInventory() function
//-----------------------------------------------------------------

function addInventory() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the product?"
            },

            {
                name: "quantity",
                type: "input",
                message: "How many do you want to add?"
            }
        ])
        .then(function (answer) {
            var id = answer.id;
            var qty = answer.quantity;
            var newQty = 0;

            connection.query("SELECT item_id, stock_quantity FROM product WHERE item_id=?", [id], function (err, result, fields) {
                if (err) {
                    return console.log('error:' + err.message);
                }
                newQty = result[0].stock_quantity + parseInt(qty);
                console.log("Updating stock quantity...")
                connection.query("UPDATE product SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newQty
                        },

                        {
                            item_id: id,

                        },
                    ],
                    function (err, result, fields) {
                        if (err) {
                            return console.log('error:' + err.message);
                        }

                    });
            });

            waitUpdate();
        });

}

// mainMenu() function
//-----------------------------------------------------------------
function mainMenu() {
    console.log("--------------MyStore Manager-----------------")
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "Add New Product",
                "View Low Inventory",
                "Add to Inventory",
                new inquirer.Separator(),
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "Add New Product":
                    addProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        });
}
console.clear();
mainMenu();