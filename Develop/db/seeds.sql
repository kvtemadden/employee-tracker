INSERT INTO department(id, name)
VALUES (1, "Sales"),
(2, "HR"),
(3, "IT");

INSERT INTO role(id, title, salary, department_id)
VALUES(1, "Sales Executive", 18000, 1),
(2, "1st Line Support Engineer", 23000, 3),
(3, "HR Manager", 42000, 2),
(4, "JavaScript Developer", 35000, 3),
(5, "Sales Manager", 37000, 1);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES (1, "Kate", "Madden", 4, null),
(2, "Mollie", "Lakey", 5, null),
(3, "George", "Georgie", 1, 2),
(4, "Sharon", "Shareen", 3, null),
(5, "Sam", "Green", 2, 1);