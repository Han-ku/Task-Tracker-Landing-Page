drop table if exists user_demographics;
drop table if exists user_comments;

drop database if exists myDB;

create database myDB;
use myDB;

create table user_demographics (
	user_id int not null auto_increment,
    first_name varchar(50),
    last_name varchar(50),
    username varchar(50),
    user_password varchar(50),
    birth_date date,
    gender varchar(10),
    primary key (user_id)
);

create table user_comments (
	comment_id int not null auto_increment,
    user_id int not null,
    description_comment varchar(1000),
    post_date datetime default current_timestamp,
    primary key (comment_id),
    foreign key (user_id) references user_demographics(user_id)
);

insert into user_demographics(first_name, last_name, username, user_password, birth_date) 
values
('Leslie', 'Knope', 'lesknop', '123', '1979-09-25'),
('Tom', 'Haverford', 'tohaverf', '123','1987-03-04'),
('April', 'Ludgate', 'aplud', '123', '1994-03-27'),
('Jerry', 'Gergich', 'gerje', '123', '1962-08-28'),
('Donna', 'Meagle', 'meadonna', '123', '1977-07-30'),
('Ann', 'Perkins', 'annaper', '123', '1988-12-01'),
('Chris', 'Traeger', 'tiger', '123', '1980-11-11'),
('Ben', 'Wyatt', 'wyatt', '123', '1985-07-26'),
('Andy', 'Dwyer', 'andyyy', '123', '1989-03-25'),
('Mark', 'Brendanawicz', 'markbrendan', '123', '1983-06-14'),
('Craig', 'Middlebrooks', 'craigman', '123', '1986-07-27');

insert into user_comments(user_id, description_comment)
values
(2, 'polecam'),
(4, 'super puper'),
(5, 'not bad'),
(11, 'polecam'),
(8, 'super puper'),
(6, 'not bad');

select * from user_comments_with_details;
drop view if exists user_comments_with_details;

create view user_comments_with_details as
select 
    uc.comment_id,
    uc.user_id,
    uc.description_comment,
    uc.post_date,
    ud.username,
    ud.first_name,
    ud.last_name,
    ud.birth_date
from 
    user_comments uc
join 
    user_demographics ud on uc.user_id = ud.user_id
