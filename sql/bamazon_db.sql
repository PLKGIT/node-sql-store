-- Drops the bamazon_db if it exists currently --
DROP DATABASE IF EXISTS bamazon_db;
-- Creates the "bamazon_db" database --
CREATE DATABASE bamazon_db;

-- Makes it so all of the following code will affect bamazon_db --
USE bamazon_db;

-- Drops the Product Table if it exists currently --
DROP TABLE IF EXISTS product;
-- Create Product Table --
CREATE TABLE product (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_id INTEGER(3) NOT NULL,
    price DECIMAL(10 , 2 ) NOT NULL,
    stock_quantity INTEGER(10),
    sales DECIMAL(10 , 2 ),
    PRIMARY KEY (item_id)
);

-- Add products to the Product Table --
INSERT INTO product  (product_name, department_id, price, stock_quantity,sales)
VALUES ("Sony Television", 3,199.99, 100,0);
INSERT INTO product  (product_name, department_id, price, stock_quantity,sales)
VALUES ("Samsung Television", 3,179.99, 75,0);
INSERT INTO product  (product_name, department_id, price, stock_quantity,sales)
VALUES ("LG Television", 3,129.99, 50,0);
INSERT INTO product  (product_name, department_id, price, stock_quantity,sales)
VALUES ("MacBook", 3,799.99, 120,0);
INSERT INTO product  (product_name, department_id, price, stock_quantity,sales)
VALUES ("MacBook Pro", 3,1099.99, 150,0);
INSERT INTO product  (product_name, department_id, price, stock_quantity,sales)
VALUES ("Football", 5,29.99, 50,0);
INSERT INTO product  (product_name, department_id, price, stock_quantity,sales)
VALUES ("Baseball",5, 19.99, 75,0);
INSERT INTO product  (product_name, department_id, price, stock_quantity,sales)
VALUES ("Basketball",5, 49.99, 100,0);
INSERT INTO product  (product_name, department_id, price, stock_quantity,sales)
VALUES ("Blanket",2, 39.99, 25,0);
INSERT INTO product  (product_name, department_id, price, stock_quantity,sales)
VALUES ("Spread",2, 19.99, 55,0);


-- Drops the Department Table if it exists currently --
DROP TABLE IF EXISTS department;
-- Create Department Table --
CREATE TABLE department (
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10 , 2 ) NOT NULL,
    PRIMARY KEY (department_id)
);

-- Add Departments to the Department Table --
INSERT INTO department (department_name, over_head_costs)
VALUES ("Bedding", 30000);
INSERT INTO department (department_name, over_head_costs)
VALUES ("Clothing", 40000);
INSERT INTO department (department_name, over_head_costs)
VALUES ("Electronics", 100000);
INSERT INTO department (department_name, over_head_costs)
VALUES ("Furniture", 75000);
INSERT INTO department (department_name, over_head_costs)
VALUES ("Sports", 25000);