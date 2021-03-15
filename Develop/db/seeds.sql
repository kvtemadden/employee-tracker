INSERT INTO department(name)
VALUES ("Sales"),
("HR"),
("IT");

INSERT INTO role(title, salary, department_id)
VALUES("Sales Executive", 18000, 1),
("1st Line Support Engineer", 23000, 3),
("HR Manager", 42000, 2),
("JavaScript Developer", 35000, 3),
("Sales Manager", 37000, 1);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Kate", "Madden", 4, null),
("Mollie", "Lakey", 5, null),
("George", "Georgie", 1, 2),
("Sharon", "Shareen", 3, null),
("Sam", "Green", 2, 1);