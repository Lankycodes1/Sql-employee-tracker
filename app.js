
const inquirer = require('inquirer');
const connection = require('./connection');

function start() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit',
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all departments':
                    viewDepartments();
                    break;

                case 'View all roles':
                    viewRoles();
                    break;

                case 'View all employees':
                    viewEmployees();
                    break;

                case 'Add a department':
                    addDepartment();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'Add an employee':
                    addEmployee();
                    break;

                case 'Update an employee role':
                    updateEmployeeRole();
                    break;

                case 'Exit':
                    connection.end();
                    break;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
}

function viewDepartments() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        start();
    });
}

function viewRoles() {
    const query = 'SELECT * FROM role';
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        start(); 
    });
}

function viewEmployees() {
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);
        start(); 
    });
}

function addDepartment() {
    inquirer
        .prompt({
            name: 'name',
            type: 'input',
            message: 'Enter the name of the department:',
        })
        .then((answer) => {
            const query = 'INSERT INTO department (name) VALUES (?)';
            connection.query(query, [answer.name], (err, res) => {
                if (err) throw err;

                console.log('Department added successfully!');
                start();
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the role title:',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the role salary:',
            },
            {
                name: 'department_id',
                type: 'input',
                message: 'Enter the department ID for this role:',
            },
        ])
        .then((answer) => {
            const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            connection.query(query, [answer.title, answer.salary, answer.department_id], (err, res) => {
                if (err) throw err;

                console.log('Role added successfully!');
                start();
            });
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'Enter the employee\'s first name:',
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'Enter the employee\'s last name:',
            },
            {
                name: 'role_id',
                type: 'input',
                message: 'Enter the role ID for this employee:',
            },
            {
                name: 'manager_id',
                type: 'input',
                message: 'Enter the manager\'s employee ID (or leave blank for no manager):',
            },
        ])
        .then((answer) => {
            const roleCheckQuery = 'SELECT * FROM role WHERE id = ?';
            connection.query(roleCheckQuery, [answer.role_id], (roleErr, roleRes) => {
                if (roleErr) throw roleErr;

                if (roleRes.length === 0) {
                    console.log('Error: The provided role_id does not exist in the role table.');
                    start(); 
                } else {
                    
                    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                    connection.query(query, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id || null], (err, res) => {
                        if (err) throw err;

                        console.log('Employee added successfully!');
                        start(); 
                    });
                }
            });
        });
}


function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                name: 'employee_id',
                type: 'input',
                message: 'Enter the employee ID you want to update:',
            },
            {
                name: 'new_role_id',
                type: 'input',
                message: 'Enter the new role ID for this employee:',
            },
        ])
        .then((answer) => {
            const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
            connection.query(query, [answer.new_role_id, answer.employee_id], (err, res) => {
                if (err) throw err;

                console.log('Employee role updated successfully!');
                start(); 
            });
        });
}

// Call the start function 
start();
