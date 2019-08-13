-- USERS
CREATE TABLE IF NOT EXISTS users (
    id BIGINT auto_increment,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    login VARCHAR(150) NOT NULL,
    pwd VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
)  ENGINE=INNODB;

-- insert user admin
INSERT INTO nodejs.users
(first_name, last_name, login, pwd)
VALUES('Eduardo', 'Gabriel', 'adm', 'adm');


-- customer
CREATE TABLE IF NOT EXISTS customer (
    id BIGINT auto_increment,
    customer_registry BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_cep BIGINT NOT NULL,
    customer_placement VARCHAR(150) NOT NULL,
    customer_state VARCHAR(50) NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_neighborhood VARCHAR(100) NOT NULL,
    customer_telephone VARCHAR(100) NOT NULL,
    customer_cellphone VARCHAR(100) NOT NULL,
    customer_mail VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
)  ENGINE=INNODB;

CREATE INDEX user_search
ON customer (customer_name);


-- vehicle
CREATE TABLE IF NOT EXISTS vehicle (
    id BIGINT auto_increment,
    license_plate VARCHAR(50) NOT NULL,
    model VARCHAR(120) NOT NULL,
    mileage BIGINT NOT NULL,
    yearModel BIGINT NOT NULL,
    engine VARCHAR(30) NOT NULL,
    fuel VARCHAR(50) NOT NULL,
    color VARCHAR(60) NOT NULL,
    idCustomer BIGINT NOT null,
    PRIMARY KEY (id)
)  ENGINE=INNODB;



-- ITENS
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT,
    name VARCHAR(255),
    qty int,
    amount VARCHAR(255),
    PRIMARY KEY (id)
)  ENGINE=INNODB;