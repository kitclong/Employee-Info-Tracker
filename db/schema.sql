DROP DATABASE IF EXISTS employee_database;
CREATE DATABASE employee_database;

USE employee_database;

CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER
);

CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER
);

/*Run in mysql workbench from seed file

INSERT INTO departments (department_name) VALUES
("Accounts"), 
("Engineering"), 
("Sales"), 
("Legal"), 
("Marketing");

INSERT INTO roles (title, salary, department_id) VALUES
("Senior Enginner", 120000, 2),
("Accounts Manager", 75000, 1), 
("Marketing Manager", 85000, 5), 
("Accountant", 70000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Smith', 1, 1), 
('Tim', 'Johnson', 1, null), 
('Steve', 'Brown', 2, 2), 
('Sally', 'Jones', 3, 5), 
('Kevin', 'Bird', 4, null);