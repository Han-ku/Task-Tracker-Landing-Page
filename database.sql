drop table if exists user_demographics;
drop table if exists user_comments;
drop table if exists user_photo;
drop database if exists myDB;

select * from user_comments_with_details;
drop view if exists user_comments_with_details;

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
    description_comment varchar(200),
    post_date datetime default current_timestamp,
    primary key (comment_id),
    foreign key (user_id) references user_demographics(user_id)
);

create table user_photo (
	photo_id int not null auto_increment,
    user_id int not null,
    photo blob,
    primary key (photo_id),
    foreign key (user_id) references user_demographics(user_id)
);

insert into user_demographics(first_name, last_name, username, user_password, birth_date, gender) 
values
('Leslie', 'Knope', 'lesknop', '123', '1979-09-25', 'Female'),
('Tom', 'Haverford', 'tohaverf', '123','1987-03-04', 'Male'),
('April', 'Ludgate', 'aplud', '123', '1994-03-27', 'Female'),
('Jerry', 'Gergich', 'gerje', '123', '1962-08-28','Male'),
('Donna', 'Meagle', 'meadonna', '123', '1977-07-30','Female'),
('Ann', 'Perkins', 'annaper', '123', '1988-12-01', 'Female'),
('Chris', 'Traeger', 'tiger', '123', '1980-11-11', 'Male'),
('Ben', 'Wyatt', 'wyatt', '123', '1985-07-26', 'Male'),
('Andy', 'Dwyer', 'andyyy', '123', '1989-03-25', 'Male'),
('Mark', 'Brendanawicz', 'markbrendan', '123', '1983-06-14', 'Male'),
('Craig', 'Middlebrooks', 'craigman', '123', '1986-07-27', 'Male');

insert into user_comments(user_id, description_comment)
values
(2, 'polecam'),
(4, 'super puper'),
(5, 'not bad'),
(11, 'polecam'),
(8, 'super puper'),
(6, 'not bad');

insert into user_photo(user_id, photo) 
values
(2, LOAD_FILE('https://img.icons8.com/?size=100&id=80571&format=png&color=000000')),
(4, LOAD_FILE('C:/Users/annak/OneDrive/Рабочий стол/myDB/users/black-cat(1)')),
(5, LOAD_FILE('C:/Users/annak/OneDrive/Рабочий стол/myDB/users/cat(1)')),
(11, LOAD_FILE('C:/Users/annak/OneDrive/Рабочий стол/myDB/users/cat')),
(8, LOAD_FILE('C:/Users/annak/OneDrive/Рабочий стол/myDB/users/kitty(1)')),
(6, LOAD_FILE('C:/Users/annak/OneDrive/Рабочий стол/myDB/users/kitty')),
(3, LOAD_FILE('C:/Users/annak/OneDrive/Рабочий стол/myDB/users/pet'));


create view user_comments_with_details as
select 
    uc.comment_id,
    uc.user_id,
    uc.description_comment,
    uc.post_date,
    ud.username,
    ud.first_name,
    ud.last_name,
    ud.birth_date,
    ud.gender,
    up.photo
from 
    user_comments uc
join 
    user_demographics ud on uc.user_id = ud.user_id
left join 
    user_photo up on uc.user_id = up.user_id;
