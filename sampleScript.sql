DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;
USE bamazon;
CREATE TABLE products (
	item_id INTEGER(10) NOT NULL auto_increment,
	product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30),
    price DECIMAL(6,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    product_sales DECIMAL(6,2) NOT NULL,
	PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES 
	("Gloves", "Clothing", 12.99, 35, 0),
    ("Ugly Sweater", "Clothing", 25.50, 4, 0),
    ("Seahawks Hoodie", "Clothing", 32.59, 17, 0),
    ("Twilight", "Book", 19.50, 100, 0),
    ("Harry Potter", "Book",32.29, 150, 0),
    ("To Kill a Mocking Bird", "Book",27.99, 80, 0),
    ("Nintendo Switch", "Electronics",132.50, 35, 0),
    ("iRobot", "Electronics",435.20, 3, 0),
    ("iPhone Charger", "Electronics",6.99, 99, 0),
    ("Ski Pants", "Clothing",112.80, 12, 0);


CREATE TABLE departments (
	department_id INTEGER(10) NOT NULL auto_increment,
	department_name VARCHAR(30) NOT NULL,
    over_head_costs DECIMAL(6,2) NOT NULL,
	PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES 
	("Clothing", 1500),
    ("Electronics", 2000),
    ("Book", 1000);
  