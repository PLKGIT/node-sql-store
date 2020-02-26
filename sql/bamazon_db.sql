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
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10 , 2 ) NOT NULL,
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
);

-- Add products to the Product Table --
INSERT INTO product  (product_name, department_name, price, stock_quantity)
VALUES ("Sony Television", "Electronics",199.99, 100);
INSERT INTO product  (product_name, department_name, price, stock_quantity)
VALUES ("Samsung Television", "Electronics",179.99, 75);
INSERT INTO product  (product_name, department_name, price, stock_quantity)
VALUES ("LG Television", "Electronics",129.99, 50);
INSERT INTO product  (product_name, department_name, price, stock_quantity)
VALUES ("MacBook", "Electronics",799.99, 120);
INSERT INTO product  (product_name, department_name, price, stock_quantity)
VALUES ("MacBook Pro", "Electronics",1099.99, 150);
INSERT INTO product  (product_name, department_name, price, stock_quantity)
VALUES ("Football", "Sports",29.99, 50);
INSERT INTO product  (product_name, department_name, price, stock_quantity)
VALUES ("Baseball","Sports", 19.99, 75);
INSERT INTO product  (product_name, department_name, price, stock_quantity)
VALUES ("Basketball","Sports", 49.99, 100);
INSERT INTO product  (product_name, department_name, price, stock_quantity)
VALUES ("Blanket","Bedding", 39.99, 25);
INSERT INTO product  (product_name, department_name, price, stock_quantity)
VALUES ("Spread","Bedding", 19.99, 55);


-- Drops the Department Table if it exists currently --
DROP TABLE IF EXISTS department;
-- Create Department Table --
CREATE TABLE department (
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10 , 2 ) NOT NULL,
    product_sales DECIMAL(10 , 2 ) NOT NULL,
    total_profit DECIMAL(10 , 2 ) NOT NULL,
    PRIMARY KEY (department_id)
);

-- Add Departments to the Department Table --
INSERT INTO department (department_name, over_head_costs,product_sales,total_profit)
VALUES ("Electronics", 10000, 20000,10000);
INSERT INTO department (department_name, over_head_costs,product_sales,total_profit)
VALUES ("Clothing", 60000, 100000,40000);
INSERT INTO department (department_name, over_head_costs,product_sales,total_profit)
VALUES ("Bedding", 50000, 200000,150000);
INSERT INTO department (department_name, over_head_costs,product_sales,total_profit)
VALUES ("Sports", 30000, 500000,470000);