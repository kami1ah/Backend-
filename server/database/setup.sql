-- database/setup.sql

DROP TABLE IF EXISTS goats;

CREATE TABLE goats (
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(30) UNIQUE NOT NULL,
  age INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO goats (name, age)
VALUES ('Michael Jordan', EXTRACT(YEAR FROM age(current_date, '1963-02-17')));

INSERT INTO goats (name, age)
VALUES ('Zinedine Zidane', EXTRACT(YEAR FROM age(current_date, '1972-06-23')));

INSERT INTO goats (name, age)
VALUES ('Ronnie O''Sullivan', EXTRACT(YEAR FROM age(current_date, '1975-12-05')));

INSERT INTO goats (name, age)
VALUES ('Tom Brady', EXTRACT(YEAR FROM age(current_date, '1977-08-03')));

INSERT INTO goats (name, age)
VALUES ('Serena Williams', EXTRACT(YEAR FROM age(current_date, '1981-09-26')));

INSERT INTO goats (name, age)
VALUES ('Lindsey Vonn', EXTRACT(YEAR FROM age(current_date, '1984-10-18')));

INSERT INTO goats (name, age)
VALUES ('Lebron James', EXTRACT(YEAR FROM age(current_date, '1984-12-30')));

INSERT INTO goats (name, age)
VALUES ('Michael Phelps', EXTRACT(YEAR FROM age(current_date, '1985-06-20')));

INSERT INTO goats(name, age)
VALUES ('Marta Vieira da Silva', EXTRACT(YEAR FROM age(current_date, '1986-02-19')));

INSERT INTO goats (name, age)
VALUES ('Simone Biles', EXTRACT(YEAR FROM age(current_date, '1997-03-14')));
