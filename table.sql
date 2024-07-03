CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    detail VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    image VARCHAR(255),
    technology VARCHAR(255)
    create_date date NOT NULL
);



CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL,
    icon VARCHAR(255),
    image VARCHAR(255),
    create_date date NOT NULL
);

CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    img VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    preview VARCHAR(255) NOT NULL,
    detail VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    post_date DATE NOT NULL
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    join_date DATE,
    role_user VARCHAR(50) DEFAULT 'user',
    img VARCHAR(255)
);

CREATE TABLE newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    post_date DATE
);
