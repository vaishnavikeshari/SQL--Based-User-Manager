create table user(
    id int primary key,
    username varchar(50) unique not null,
    email varchar(50) unique not null,
    passwor varchar(25) not null
);