const inquirer = require('inquirer');
const fs = require('fs');
const sequelize = require("./Develop/config/connection.js");
const table = require("console.table");

const questions = [{ type: "list", name: "initial", message: "What would you like to do?", choices: ["View Employees", "View Employees by Department", "View Employees by Manager", "Add Employee", "Remove Employees", "Update Employee Role", "Add Role", "Remove Role", "Update Employee Manager", "End"]}];

function init() {
    console.log("Welcome to Employee Manager!");
    inquirer.prompt(questions)
        .then((data) => {

        });
};

init();

