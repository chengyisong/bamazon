var mysql = require("mysql");
var inquirer = require("inquirer");
var asTable = require ('as-table')


var allItemNum = [];
var itemName = "";
var itemPrice = 0;
var itemQuantity = 0;
var cost = 0;
var itemMaxQuantity = 0;
var updatedMaxQuantity = 0;
var sales = 0;
var updatedSales = 0;


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
console.log("----------------                                   ----------------");
console.log("-------------------------------------------------------------------");
console.log("\x1b[0m");


function showProducts() {
    inquirer.prompt([
        {
            type:"list",
            name: "view",
            message:"Would you like to view the product list?",    
            choices:["Yes"]
        }
    ]).then(function(answer){
        if(answer.view === "Yes") {
            console.log("Here are the list of products available for you to purchase: ");
            connection.query("SELECT item_id, product_name, department_name, price, stock_quantity from products", 
            function(err, res) {
                // log error
                if (err) {
                throw err;
                }
        
                // show the table of available items to the user 
        
                console.log("\x1b[36m");
                console.log(asTable(res));
        
                console.log("\x1b[0m")
               
        
                // push all available items' ID into the array
                for(i=0; i<res.length; i++) {
                    allItemNum.push(res[i].item_id)
                }
        
                inquirer.prompt([
                    {
                        name: "id",
                        message: "Which item do you want to purchase? (Enter the Item ID)",
                        validate: function validateNum(value){
                            if (allItemNum.indexOf(parseInt(value)) <0 ) {
                                console.log("\x1b[31m", "Please provide a valid ID for the item");
                                console.log("\x1b[0m")
                                return false;
                            } 
                            else {
                                return true;
                            }
                        },
                    }
                ]).then(function(answer){
                    var itemID = parseInt(answer.id);
                    connection.query("SELECT * FROM products WHERE item_id = ?", [itemID], 
                        function(err, res){
                            console.log("-------------------------------------------------------------------");
                            console.log("\x1b[33m","You have selected this item: ");
                            console.log("\x1b[33m","Item ID: " + itemID);
                            console.log("\x1b[33m","Product Name:" + res[0].product_name);
                            console.log("\x1b[33m","Department Name" + res[0].department_name);
                            console.log("\x1b[33m","Price: " + res[0].price);
                            console.log("\x1b[0m","-------------------------------------------------------------------");
                            itemMaxQuantity = res[0].stock_quantity;
                            itemName = res[0].product_name;
                            itemPrice = res[0].price;
                            sales = res[0].product_sales;
        
                            console.log("---------------------------------------------------------");
                            console.log("---------------------------------------------------------");
        
                            inquirer.prompt([
                                {
                                    name: "quantity",
                                    message: "How many pieces of " + itemName + " would you like to purchase? \n (The total quantity available for this item is " + itemMaxQuantity + ")",
                                    validate: function withinMaxQuantity(value){
                                        if (isNaN(value) || parseInt(value)<=0 ) {
                                            console.log("\x1b[31m", "Please provide a valid amount for the item that you want to purchase!");
                                            console.log("\x1b[0m");
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }
                                }
                            ]).then(function(answer){
                                console.log("---------------------------------------------------------");
                                console.log("---------------------------------------------------------");
                                if (answer.quantity > itemMaxQuantity) {
                                    console.log("\x1b[31m","Insufficient quantity! Please retry by placing an order for the quantity that is available!");
                                    console.log("\x1b[0m");
                                    showProducts();
        
                                } else {
                                    itemQuantity = answer.quantity;
                                    cost = itemQuantity * itemPrice;
                                    updatedSales = parseInt(sales) + cost;
                                    console.log("\x1b[33m","You will be purchasing: " + itemQuantity + " pieces of " + itemName);
                                    console.log("Your total cost will be: " + cost);
                                    inquirer.prompt([
                                        {
                                            type:"list",
                                            name: "confirm",
                                            message:"Please confirm your order.",
                                            choices: ["Yes! Place my order please!", "No.... I will reconsider..."]
                                        }
                                    ]).then(function(answer){
                                        if(answer.confirm === "Yes! Place my order please!") {
                                            console.log("---------------------------------------------------------");
                                            console.log("---------------------------------------------------------");
                                            console.log("\x1b[35m","Congratulations! Your order has been placed:");
                                            console.log("Product Name: " + itemName);
                                            console.log("Quantity: " + itemQuantity);
                                            console.log("Total Amount Paid: " + cost);
        
                                            updatedMaxQuantity = itemMaxQuantity - itemQuantity;
        
                                            connection.query("UPDATE products SET stock_quantity= ? WHERE item_id= " + itemID, [updatedMaxQuantity]);
                                            
                                            connection.query("UPDATE products SET product_sales= ? WHERE item_id= " + itemID, [updatedSales]);

                                            showProducts();
                                        
                                        } 
                                        else {
                                            console.log("Take your time! Please purchase the order when you are ready!");
                                            showProducts();
                                        }
                                    })
                                }
                                
                            })
                        }
                    )
                    
                })
            }
        )
        }
    })


}

showProducts();



