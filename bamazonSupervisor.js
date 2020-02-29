// bamazonSupervisor.js
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
    await new Promise(resolve => setTimeout(resolve, 10000));
    viewDepartments();
}

// viewSales() function
//-----------------------------------------------------------------
function viewSales() {
    connection.query("SELECT department.department_id,department.department_name,department.over_head_costs, SUM(product.sales) AS total_sales from department LEFT JOIN product USING(department_id) GROUP BY department_id ORDER BY department_id;", function (err, result, fields) {
        if (err) {
            return console.log('error:' + err.message);
        }
        console.log("----------Product Sales by Department----------")
        var resultsTable = new Table({
            head: ['Dept ID', 'Department', 'Overhead', 'Sales', 'Profit']
        });

        // console.log(result);
        for (i = 0; i < result.length; i++) {
            if (result[i].total_sales === null) {
                var total = 0;
            } else {
                var total = result[i].total_sales;
            }
            var repTotal = total.toFixed(2);
            var overhead = result[i].over_head_costs;
            var repOH = overhead.toFixed(2);
            var total_profit = repTotal - repOH;
            var repProfit = total_profit.toFixed(2);

            resultsTable.push([result[i].department_id, result[i].department_name, numberWithCommas(repOH), numberWithCommas(repTotal), numberWithCommas(repProfit)])

        };
        console.log(resultsTable.toString());
    });
    waitView();
}

// viewDepartments() function
//-----------------------------------------------------------------
function viewDepartments() {
    connection.query("SELECT department_id, department_name, over_head_costs FROM department ORDER BY department_name", function (err, result, fields) {
        if (err) {
            return console.log('error:' + err.message);
        }
        var resultsTable = new Table({
            head: ['ID', 'Department', 'Overhead']
        });

        for (i = 0; i < result.length; i++) {
            resultsTable.push([result[i].department_id, result[i].department_name, numberWithCommas(result[i].over_head_costs)])
        };
        console.clear();
        console.log(resultsTable.toString());
    });
    waitView();
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

// addDepartment() function
//-----------------------------------------------------------------

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "department_name",
                type: "input",
                message: "What is the new department's name?"
            },

            {
                name: "overhead",
                type: "input",
                message: "What is the department's overhead amount?"
            }
        ])
        .then(function (answer) {
            var name = answer.department_name;
            var overhead = answer.overhead;

            console.log("Adding " + name + "(s)...");
            connection.query("INSERT INTO department SET ?",
                {
                    department_name: name,
                    over_head_costs: overhead
                },

                function (err, result, fields) {
                    if (err) {
                        return console.log('error:' + err.message);
                    }

                });

            waitAdd();
        });

}

// mainMenu() function
//-----------------------------------------------------------------
function mainMenu() {
    console.log("--------------MyStore Supervisor-----------------")
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Product Sales by Department",
                "View Departments",
                "Add a New Department",
                "View Products for Sale",
                new inquirer.Separator(),
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Product Sales by Department":
                    viewSales();
                    break;

                case "View Products for Sale":
                    viewProducts();
                    break;

                case "Add a New Department":
                    addDepartment();
                    break;

                case "View Departments":
                    viewDepartments();
                    break

                case "Exit":
                    connection.end();
                    break;
            }
        });
}
console.clear();
mainMenu();