var mysql = require("mysql");
var inquirer = require("inquirer");
var asTable = require('as-table')

var allItemNum = [];
var allDepartment = [];
var itemName = "";
var addedQuantity = 0;
var itemQuantity = 0;
var updatedQuantity = 0;

var connection = mysql.createConnection({
    // connect to local host
    host: "localhost",
    port: 3306,
    user: "root",
    password: "900922",
    database: "bamazon"
})

console.log("\x1b[35m");
console.log("-------------------------------------------------------------------");
console.log("----------------                                   ----------------");
console.log("----------------         Welcome to B Amazon!      ----------------");
console.log("----------------    (You are in Manger View Mode)  ----------------");
console.log("----------------                                   ----------------");
console.log("-------------------------------------------------------------------");
console.log("\x1b[0m");


function mainMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["1) View Products for Sale", "2) View Low Inventory", "3) Add to Inventory", "4) Add New Product"],
        }
    ]).then(function (answer) {
        if (answer.choice === "1) View Products for Sale") {
            connection.query("SELECT * FROM products",
                function (err, res) {
                    // log error
                    if (err) {
                        throw err;
                    }

                    // show the table of available items to the user 
                    console.log("\x1b[36m");
                    console.log(asTable(res));
                    console.log("\x1b[0m");

                    returnToMain()
                })
        }
        else if (answer.choice === "2) View Low Inventory") {
            connection.query("SELECT * FROM products WHERE stock_quantity < 5",
                function (err, res) {
                    // log error
                    if (err) {
                        throw err;
                    }

                    // show the table of available items to the user 
                    console.log("\x1b[36m");
                    console.log(asTable(res));
                    console.log("\x1b[0m");
                    returnToMain()
                })
        }
        else if (answer.choice === "3) Add to Inventory") {
            
            connection.query("SELECT * FROM products",
                function (err, res) {
                    // log error
                    if (err) {
                        throw err;
                    }

                    // show the table of available items to the user 
                    console.log("\x1b[36m");
                    console.log(asTable(res));
                    console.log("\x1b[0m");
                    console.log("\x1b[0m")

                    // push all available items' ID into the array
                    for (i = 0; i < res.length; i++) {
                        allItemNum.push(res[i].item_id)
                    }

                    inquirer.prompt([
                        {
                            name: "id",
                            message: "Which item do you want to add? (Enter the Item ID)",
                            validate: function validateNum(value) {
                                if (allItemNum.indexOf(parseInt(value)) < 0) {
                                    console.log("\x1b[31m", "Please provide a valid ID for the item");
                                    console.log("\x1b[0m");
                                    return false;
                                }
                                else {
                                    return true;
                                }
                            },
                        }
                    ]).then(function (answer) {
                        var itemID = parseInt(answer.id);
                        connection.query("SELECT * FROM products WHERE item_id = ?", [itemID],
                            function (err, res) {
                                console.log("-------------------------------------------------------------------");
                                console.log("\x1b[33m", "You have selected this item: ");
                                console.log("\x1b[33m", "Item ID: " + itemID);
                                console.log("\x1b[33m", "Product Name: " + res[0].product_name);
                                console.log("\x1b[33m", "Department Name: " + res[0].department_name);
                                console.log("\x1b[33m", "Price: " + res[0].price);
                                console.log("\x1b[0m", "-------------------------------------------------------------------");
                                itemName = res[0].product_name;
                                itemQuantity = res[0].stock_quantity;

                                console.log("---------------------------------------------------------");
                                console.log("---------------------------------------------------------");

                                inquirer.prompt([
                                    {
                                        name: "quantity",
                                        message: "How many pieces of " + itemName + " would you like to add to inventory?",
                                        validate: function withinMaxQuantity(value) {
                                            if (isNaN(value) || parseInt(value) <= 0) {
                                                console.log("\x1b[31m", "Please provide a valid amount for the item that you want to add!");
                                                console.log("\x1b[0m");
                                                return false;
                                            } else {
                                                return true;
                                            }
                                        }
                                    }
                                ]).then(function (answer) {
                                    console.log("---------------------------------------------------------");
                                    console.log("---------------------------------------------------------");
                                    addedQuantity = parseInt(answer.quantity);
                                    console.log("\x1b[33m","You have added: " + addedQuantity + " pieces of " + itemName);

                                    updatedQuantity = itemQuantity + addedQuantity;

                                    connection.query("UPDATE products SET stock_quantity= ? WHERE item_id= " + itemID, [updatedQuantity]);

                                    returnToMain()

                                })
                            }


                        )

                    })
                }
            )
        }


        else if (answer.choice === "4) Add New Product") {
            connection.query("SELECT * FROM departments",
                function (err, res) {
                    // log error
                    if (err) {
                        throw err;
                    }                  

                    // push all available department names into the array
                    for (i = 0; i < res.length; i++) {
                        allDepartment.push(res[i].department_name)
                    }
                }
            )

            inquirer.prompt([
                {
                    name: "productName",
                    message: "What is the name of the product that you want to add?",
                },
                {
                    type: "list",
                    name: "departmentName",
                    message: "What is the department of this product?",
                    choices: allDepartment,
                },
                {
                    name: "price",
                    message: "What is the unit price of this product? Enter a number",
                    validate: function validateNum(value) {
                        if (isNaN(value) || parseInt(value) <= 0 || parseInt(value)>9999.99) {
                            console.log("\x1b[31m", "Please provide a valid price (between $0.11 and $9999.99 for this product!");
                            console.log("\x1b[0m");
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                {
                    name: "quantity",
                    message: "What is the quantity of this product?",
                    validate: function validateNum(value) {
                        if (isNaN(value) || parseInt(value) <= 0) {
                            console.log("\x1b[31m", "Please provide a valid quantity for this product!");
                            console.log("\x1b[0m");
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            ]).then(function (answer) {
                connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) VALUES ('" + answer.productName + "', '" + answer.departmentName + "'," + answer.price + "," + answer.quantity + ", 0 )");

                console.log("---------------------------------------------------------");
                console.log("---------------------------------------------------------");
                console.log("\x1b[33m","Congratulations! You have added " + answer.quantity + " pieces of " + answer.productName + " into the inventory!");

                returnToMain();
            })
        }
    })
}


function returnToMain() {
    inquirer.prompt([
        {
            type: "list",
            name: "return",
            message: "Return to the main menu",
            choices: ["Ok!"]
        }
    ]).then(function (answer) {
        mainMenu();
    })

}


mainMenu()