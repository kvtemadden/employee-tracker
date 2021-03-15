DROP DATABASE IF EXISTS employee_trackerdb;
CREATE DATABASE employee_trackerdb;

USE employee_trackerdb;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT
);

ALTER TABLE role
ADD FOREIGN KEY (department_id) REFERENCES department(id);

ALTER TABLE employee
ADD FOREIGN KEY (role_id) REFERENCES role(id);