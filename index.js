const inquirer = require('inquirer');
const connection = require("./Develop/config/connection.js");
const table = require("console.table");
const { rightPadder } = require('easy-table');
var staff = [];
var roles = [];
var dep = [];


const questions = [{ type: "list", name: "initial", message: "What would you like to do?", choices: ["View Employees", "View Employees by Department", "View Employees by Manager", "View Departments", "View Roles", "View Department Budgets", "Add Employee", "Add Department", "Remove Employee", "Remove Department", "Update Employee Role", "Add Role", "Remove Role", "Update Employee Manager", "Exit"] }];

console.log(`Welcome to Employee Manager!\n`);

function init() {
    inquirer.prompt(questions).then(({ initial }) => {
        switch (initial) {
            case "View Employees":
                viewEmployee();
                break;
            case "View Employees by Manager":
                viewEmployeeByManager();
                break;
            case "View Employees by Department":
                viewEmployeeByDepartment();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Department Budgets":
                viewDepartmentBudget();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "Remove Employee":
                deleteEmployee();
                break;
            case "Remove Department":
                deleteDepartment();
                break;
            case "Remove Role":
                deleteRole();
                break;
            case "Exit":
                console.log("Process Ended");
                connection.end();
                break;
        }
    });
};

init();

function viewEmployee() {
    console.log("Employee Rota:\n");

    var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e  
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
    ON m.id = e.manager_id`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        init();
    });
}

function viewEmployeeByManager() {
    inquirer.prompt({ 
        type: "input", 
        name: "viewMng", 
        message: "What's the ID of the manager you want to view employees for?" 
        }).then(({ viewMng }) => {
        
            if (!viewMng) {
            console.log("Manager not found");
            init();
        }
        else {
            console.log(`\nEmployees By Manager:\n`);

            var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
            FROM employee e  
            LEFT JOIN role r
            ON e.role_id = r.id
            LEFT JOIN department d
            ON d.id = r.department_id
            LEFT JOIN employee m
            ON m.id = e.manager_id
            WHERE m.id = ?`;

            connection.query(query, (viewMng), function (err, res) {
                if (err) throw err;

                console.table(res);
                init();
            });
        }
    })
}

function viewEmployeeByDepartment() {
    inquirer.prompt({ type: "input", name: "viewDpt", message: "What's the ID of the department you want to view employees for?" }).then(({ viewDpt }) => {
        if (!viewDpt) {
            console.log("Department not found");
            init();
        }
        else {
            console.log(`\nEmployees By Department:\n`);

            var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
			FROM employee e
			JOIN role r
			ON e.role_id = r.id
			JOIN department d
			ON d.id = r.department_id
			WHERE d.id = ?`;

            connection.query(query, (viewDpt), function (err, res) {
                if (err) throw err;

                console.table(res);
                init();
            });
        }
    })
}

function viewDepartments() {
    console.log(`\nDepartments:\n`);

    var query = `SELECT d.name AS department
	FROM department d`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        init();
    });
};

function viewRoles() {
    console.log(`\nRoles:\n`);

    var query = `SELECT r.title AS role
	FROM role r`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        init();
    });
};

function viewDepartmentBudget() {
    console.log(`\nDepartment Budget:\n`);

    var query = `SELECT d.name, sum(r.salary) AS budget
    FROM employee e 
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    group by d.name`;

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        init();
    })
};

function addEmployee() {
    connection.query(
        `SELECT * FROM employee`,
        (err, res) => {
            if (err) throw err;
            res.forEach((e) => {
                staff.push(`${e.id} ${e.first_name}`);
            })

    connection.query(`SELECT id, title FROM role`, (err, res) => {
        if (err) throw err;

        res.forEach((element) => {
            roles.push(`${element.id} ${element.title}`);
        });

    inquirer.prompt([{
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?"
    },
    {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?"
    },
    {
        type: "list",
        choices: roles,
        name: "roleId",
        message: "What is the employee's role?"
    },
    {
        type: "list",
        choices: staff,
        name: "managerId",
        message: "Who is the employee's manager?"
    }
    ]).then(function (response) {
        let selectedRole = response.roleId.split(" ")[0];
        let selectedMng = response.managerId.split(" ")[0];

        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.firstName, response.lastName, selectedRole, selectedMng], function (err, data) {
            if (err) throw err;
            console.log("Successfully Inserted");
            viewEmployee();
            init();
        })
    })
 })
})
};

function addDepartment() {
    inquirer.prompt({ type: "input", name: "department", message: "What is the department that you want to add?" }).then(function (res) {
        var query = 'INSERT INTO department (name) VALUES (?)';
        connection.query(query, [res.department], function (err, data) {
            if (err) throw err;
            console.log("Successfully Inserted");
            init();
            viewDepartments();
        })
    })
};

function addRole() {
    inquirer.prompt([
        {
            message: "enter title:",
            type: "input",
            name: "title"
        }, {
            message: "enter salary:",
            type: "number",
            name: "salary"
        }, {
            message: "enter department ID:",
            type: "number",
            name: "department_id"
        }
    ]).then(function (data) {
        var query = "INSERT INTO role (title, salary, department_id) values (?, ?, ?)";
        connection.query(query, [data.title, data.salary, data.department_id], function (err, data) {
            if (err) throw err;
            console.log("Successfully Added!");
            viewRoles();
        })
    })
};

function updateEmployeeRole() {
    console.log(`\nRole update:\n`)
    connection.query(
        `SELECT * FROM employee`,
        (err, res) => {
            if (err) throw err;
            res.forEach((e) => {
                staff.push(`${e.id} ${e.first_name}`);
            })
            connection.query(`SELECT id, title FROM role`, (err, res) => {
                if (err) throw err;

                res.forEach((element) => {
                    roles.push(`${element.id} ${element.title}`);
                });
                inquirer.prompt([
                    {
                        message: "Which employee do you want to update?",
                        type: "list",
                        choices: staff,
                        name: "name"
                    },
                    {
                        message: "choose their role",
                        type: "list",
                        choices: roles,
                        name: "role_name"
                    }
                ]).then(function (response) {
                    let selectedEmployee = response.name.split(" ")[0];
                    let selectedRole = response.role_name.split(" ")[0];

                    connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [selectedRole, selectedEmployee], function (err, data) {
                        console.table(data);
                    })
                    init();
                })
            })
        })
            };
            
function updateEmployeeManager() {
    console.log(`\nManager Update\n`);
    connection.query(
        `SELECT * FROM employee`,
        (err, res) => {
            if (err) throw err;
            res.forEach((e) => {
                staff.push(`${e.id} ${e.first_name}`);
            })
                inquirer.prompt([
                    {
                        message: "Which employee do you want to update?",
                        type: "list",
                        choices: staff,
                        name: "name"
                    },
                    {
                        message: "Who do you want to set as their manager?",
                        type: "list",
                        choices: staff,
                        name: "mng_name"
                    }
                ]).then(function (response) {
                    let selectedEmployee = response.name.split(" ")[0];
                    let selectedMng = response.mng_name.split(" ")[0];

                    connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [selectedMng, selectedEmployee], function (err, data) {
                        console.table(data);
                    })
                    init();
                })
            })
};
 
function deleteEmployee() {
    console.log(`\nDeleting an Employee:\n`);
    connection.query(
        `SELECT * FROM employee`,
        (err, res) => {
            if (err) throw err;
            res.forEach((e) => {
                staff.push(`${e.id} ${e.first_name}`);
            })
                inquirer.prompt([
                    {
                        message: "Which employee do you want to delete?",
                        type: "list",
                        choices: staff,
                        name: "name"
                    }])
                    .then(function (response) {
                    let selectedEmployee = response.name.split(" ")[0];

                    connection.query("DELETE FROM employee WHERE id = ?", [selectedEmployee], function (err, data) {
                        console.table(data);
                    })
                    init();
                })
            })

};

function deleteDepartment() {
    console.log(`\nDeleting a Department:\n`);
    connection.query(
        `SELECT * FROM department`,
        (err, res) => {
            if (err) throw err;
            res.forEach((d) => {
                dep.push(`${d.id} ${d.name}`);
            })
                inquirer.prompt([
                    {
                        message: "Which department do you want to delete?",
                        type: "list",
                        choices: dep,
                        name: "depname"
                    }])
                    .then(function (response) {
                        console.log(response.depname)
                    let selectedDepartment = response.depname.split(" ")[0];
                    console.log(selectedDepartment);

                    connection.query("DELETE FROM department WHERE department.id = ?", selectedDepartment, function (err, data) {
                        console.table(data);
                    })
                    init();
                })
            })

};

function deleteRole() {
    console.log(`\nDeleting a role:\n`);
    connection.query(
        `SELECT * FROM role`,
        (err, res) => {
            if (err) throw err;
            res.forEach((r) => {
                roles.push(`${r.id} ${r.title}`);
            })
                inquirer.prompt([
                    {
                        message: "Which employee do you want to delete?",
                        type: "list",
                        choices: roles,
                        name: "role"
                    }])
                    .then(function (response) {
                    let selectedRole = response.role.split(" ")[0];

                    connection.query("DELETE FROM role WHERE id = ?", [selectedRole], function (err, data) {
                        console.table(data);
                    })
                    init();
                })
            })


};