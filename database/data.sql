-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

INSERT INTO "users" ("firstName", "lastName", "email", "username", "hashedPassword")
VALUES ('Bobby', 'Lee', 'taco@gmail.com', 'username', 'p=1$dn8fwJtkkn9hyFjjuVyJRA$3+HUcwvjjl8/miAVYS/6xBwCdhsC7IBn6bZpjg3CAE8'), ('Daniel', 'Hahn', 'daniel@gmail.com', 'daniel', 'p=1$qoLuq7zPtGOfIcNHPbG2JA$vSSWqYcMPY0x4tmBGC7SMtFfsmljS4LjK5ud/fWutjE');
