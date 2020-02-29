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

-- Drops the Department Table if it exists currently --
DROP TABLE IF EXISTS department;
-- Create Department Table --
CREATE TABLE department (
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10 , 2 ) NOT NULL,
    PRIMARY KEY (department_id)
);