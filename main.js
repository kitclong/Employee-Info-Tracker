//=========================================================================================
// Load dependencies and establish connection to db

const connection = require('./config/connection');
const inquirer = require('inquirer');

connection.connect((err) => {
    if (err) throw err;
    console.log("==================================");
    console.log("===== Connection Successful! =====");
    console.log("============ WELCOME! ============");
    console.log("==================================");
    initialPrompt();
});


//=========================================================================================
// Initial prompt to user with selections to continue

const initialPrompt = (something) => {
    inquirer
        .prompt([
            {
                name: 'name',
                type: 'list',
                message: 'Please choose a selection to continue: ',
                choices: [
                    'View: Departments',
                    'View: Roles',
                    'View: Employees',
                    'Add: Department',
                    'Add: Role',
                    'Add: Employee',
                    'Update: Employee Role',
                    'Delete: Employee',
                    'Exit'
                ]
            }
        ])
        .then((response) => {
            switch (response.name) {
                case 'View: Departments':
                    viewDepartments();
                    break;
                case 'View: Roles':
                    viewRoles();
                    break;
                case 'View: Employees':
                    viewEmployees();
                    break;
                case 'Add: Department':
                    addDepartment();
                    break;
                case 'Add: Role':
                    addRole();
                    break;
                case 'Add: Employee':
                    addEmployee();
                    break;
                case 'Update: Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Delete: Employee':
                    deleteEmployee();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        });
}

//=========================================================================================
// Create table to view all from departments 

const viewDepartments = (something) => {
    const sqlQuery = 'SELECT * FROM departments';
    connection.query(sqlQuery, (err, rep) => {
        if (err) throw err;
        console.log('\n');
        console.log('====================================');
        console.log('\n');
        console.table(rep);
    });
    initialPrompt();
}

//=========================================================================================
// Create tabel to view all from employees

const viewEmployees = (something) => {
    let sqlQuery = `SELECT employees.id, 
    employees.first_name, 
    employees.last_name, 
    roles.title, 
    departments.department_name AS 'department', 
    roles.salary
    FROM employees, roles, departments 
    WHERE departments.id = roles.department_id 
    AND roles.id = employees.role_id
    ORDER BY employees.id ASC`;
    connection.query(sqlQuery, (err, rep) => {
        if (err) throw err;
        console.log('\n');
        console.log('====================================');
        console.log('\n');
        console.table(rep);
    });
    initialPrompt();
};


//=========================================================================================
// Create table to show all from roles

const viewRoles = (something) => {
    console.log('===== Displaying Roles =====');
    let sqlQuery = `SELECT * FROM roles`;
    connection.query(sqlQuery, (err, rep) => {
        if (err) throw err;
        console.log('\n');
        console.log('====================================');
        console.log('\n');
        console.table(rep);
    });
    initialPrompt();
}

//=========================================================================================
// Prompting and adding department to db 

const addDepartment = (something) => {
    inquirer
        .prompt([
            {
                name: 'name',
                type: 'input',
                message: 'Enter the departement: '
            }
        ])
        .then((response) => {
            let sqlQuery = `INSERT INTO departments SET ?`;
            console.log(response.name);

            connection.query(sqlQuery,
                {
                    department_name: response.name
                },
                (err, res) => {
                    if (err) throw err;
                    viewDepartments();
                    console.log('===== Inserting Department =====');
                    initialPrompt();
                });
        });
}

//=========================================================================================
// Prompting and adding roles to db 

const addRole = (something) => {
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter a role: '
            },
            {
                name: 'salary',
                type: 'number',
                message: 'Enter the role salary: '
            },
            {
                name: 'department_id',
                type: 'number',
                message: 'Enter the departement ID for role: '
            }
        ])
        .then((response) => {
            let sqlQuery = `INSERT INTO roles SET ?`;
            connection.query(sqlQuery,
                {
                    title: response.title,
                    salary: response.salary,
                    department_id: response.department_id
                },
                (err, res) => {
                    if (err) throw err;
                    console.log('===== Inserting Role ======');
                    viewRoles(something => {
                        initialPrompt();
                    });
                }
            );
        });
}

//=========================================================================================
// Prompt for new employee

const promptAddEmployee = (something) => {
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'Enter employees FIRST name: '
            },

            {
                name: 'last_name',
                type: 'input',
                message: 'Enter employee LAST name: '
            },

            {
                name: 'role_id',
                type: 'list',
                message: 'Enter employees role ID: ',
                choices: something
            },

            {
                name: 'manager_id',
                type: 'number',
                message: 'Enter the manager ID: '
            }
        ])
        .then(function (response) {
            let sqlQuery = `INSERT INTO employees SET ?`;
            connection.query(sqlQuery,
                {
                    first_name: response.first_name,
                    last_name: response.last_name,
                    role_id: response.role_id,
                    manager_id: response.manager_id
                },
                (err, res) => {
                    if (err) throw err;
                    viewEmployees();
                    console.log('====== Inserting employee ======');
                    initialPrompt();
                }
            );
        });
}

// Insert new employee into db

const addEmployee = (something) => {
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'Enter employees FIRST name: '
            },

            {
                name: 'last_name',
                type: 'input',
                message: 'Enter employees LAST name: '
            },

            {
                name: 'role_id',
                type: 'number',
                message: 'Enter employees role ID: '
            },

            {
                name: 'manager_id',
                type: 'number',
                message: 'Enter the manager ID: '
            }
        ])
        .then((response) => {
            let sqlQuery = `INSERT INTO employees SET ?`;
            connection.query(sqlQuery,
                {
                    first_name: response.first_name,
                    last_name: response.last_name,
                    role_id: response.role_id,
                    manager_id: response.manager_id
                },
                (err, res) => {
                    if (err) throw err;
                    promptAddEmployee();
                    console.log("===== Inserting Employee =====");
                    viewEmployees();
                }
            );
        });
}

//=========================================================================================
//Prompt for delete employee function

const promptDeleteEmployee = (deleteChoices) => {
    inquirer
        .prompt([
            {
                name: 'id',
                type: 'list',
                message: 'Which employee do you want to remove? ',
                choices: deleteChoices
            }
        ])
        .then((answer) => {
            let query = `DELETE FROM employees WHERE ?`;
            connection.query(query, { id: answer.id }, (err, res) => {
                if (err) throw err;

                console.table(res);
                console.log(res.affectedRows + 'Deleted!\n');

                initialPrompt();
            });
        });
}

// Delete employee from db

const deleteEmployee = (something) => {
    console.log("Deleting an employee");
    let query = `SELECT employees.id, employees.first_name, employees.last_name FROM employees`;

    connection.query(query, (err, res) => {
        if (err) throw err;

        const deleteChoices = res.map(({ id, first_name, last_name }) => ({
            value: id,
            title: `${id} ${first_name} ${last_name}`
        }));
        console.table(res);
        console.log('Delete!\n');
        promptDeleteEmployee(deleteChoices);
    });
}

//=========================================================================================
// Update Employee Role

const updateEmployeeRole = (something) => {
    let sqlQuery = `SELECT employees.id, employees.first_name, employees.last_name, roles.id AS "role_id" 
                    FROM employees, roles, departments 
                    WHERE departments.id = roles.department_id 
                    AND roles.id = employees.role_id`;
    connection.query(sqlQuery, (err, res) => {
        if (err) throw err;

        let employeeArray = [];
        res.forEach((employees) => { employeeArray.push(`${employees.first_name} ${employees.last_name}`); });

        let sqlQuery = `SELECT roles.id, roles.title FROM roles`;
        connection.query(sqlQuery, (err, res) => {
            if (err) throw err;

            let rolesArray = [];
            res.forEach((roles) => { rolesArray.push(roles.title); });
            inquirer
                .prompt([
                    {
                        name: 'chosenEmployee',
                        type: 'list',
                        message: 'Which employee has a new role?',
                        choices: employeeArray
                    },
                    {
                        name: 'chosenRole',
                        type: 'list',
                        message: 'What is their new role?',
                        choices: rolesArray
                    }
                ])
                .then((answer) => {

                    let newTitleId, employeeId;
                    res.forEach((roles) => {
                        if (answer.chosenRole === roles.title) {
                            newTitleId = roles.id;
                        }
                    });

                    res.forEach((employees) => {
                        if (answer.name === `${employees.first_name} ${employees.last_name}`) {
                            employeeId = employees.id;
                        }
                    });

                    let sqlQueryUpdate = `UPDATE employees SET employees.role_id = ? WHERE employees.id = ?`;
                    connection.query(
                        sqlQueryUpdate,
                        [newTitleId, employeeId],
                        (err) => {
                            if (err) throw err;
                            console.table('===== The role was updated! ======');
                            initialPrompt();
                        }
                    );
                });
        });
    });
}
