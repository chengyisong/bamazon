var mysql = require("mysql");
var inquirer = require("inquirer");
var asTable = require('as-table');

var allDepartment = [];

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
console.log("---------------- (You are in Supervisor View Mode) ----------------");
console.log("----------------                                   ----------------");
console.log("-------------------------------------------------------------------");
console.log("\x1b[0m");

function mainMenu(){
    inquirer.prompt([
        {
            type: "list",
            name: "mainMenu",
            message: "What would you like to do?",
            choices: ["1) Create New Department", "2) View Product Sales by Department"],
        }
    ]).then(function(answer){
        if(answer.mainMenu === "1) Create New Department") {
            connection.query("SELECT * FROM departments",
            function (err, res) {
                // log error
                if (err) {
                    throw err;
                }                  

                // show & push all available department names into the array
                console.log("-------------------------------------------------------------------")
                console.log("-------------------------------------------------------------------")
                console.log("Here are the current departments: ")
                for (i = 0; i < res.length; i++) {
                    console.log(i+1 + ". " + res[i].department_name)
                    allDepartment.push(res[i].department_name)
                }

                console.log("-------------------------------------------------------------------")
                console.log("-------------------------------------------------------------------")

                inquirer.prompt([
                    {
                        name: "dpmtName",
                        message: "What is the name of the new department?"
                    },
                    {
                        name: "overhead",
                        message: "How much is the overhead cost of this department?",
                        validate: function withinMaxQuantity(value) {
                            if (isNaN(value) || parseInt(value) <= 0 || parseInt(value) > 9999.99 ) {
                                console.log("\x1b[31m", "Please provide a valid amount (between $0.01 and $9999.99) as the overhead cost for this department!");
                                console.log("\x1b[0m");
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                ]).then(function(answer){
                    console.log("You have added " + answer.dpmtName + " as a new department!");
                    connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES ('" + answer.dpmtName + "', " + answer.overhead + ")");
                    returnToMain();
                })
            })
      

        }

        else if (answer.mainMenu === "2) View Product Sales by Department") {
            connection.query("SELECT d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales) AS product_sales, (sum(p.product_sales)-d.over_head_costs) AS total_profit from products p RIGHT JOIN departments d ON p.department_name=d.department_name GROUP BY d.department_id", function(err, res) {
                console.log("\x1b[36m");
                console.log(asTable(res));
                console.log("\x1b[0m");
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
    ]).then(function(answer) {
        mainMenu();
    })

}

mainMenu()