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
VALUES ('Bobby', 'Lee', 'taco@gmail.com', 'username', '$argon2i$v=19$m=4096,t=3,p=1$drFII7yZuHIyUFi8H+ei/A$0qzEImYgUE97RaUS4e+dh8mtxWibq3vmmU0FWABsnEE'), ('Daniel', 'Hahn', 'daniel@gmail.com', 'daniel', '$argon2i$v=19$m=4096,t=3,p=1$z/IkOSC2DK4CWnUCHXzZPw$cNT9DzeyEAcjVDCrucowQJScHwGHo0wPTmyvpTcPhxg'), ('Henry', 'Pham', 'asdfadsf@gmail.com', 'henry', '$argon2i$v=19$m=4096,t=3,p=1$cSZGXBbtgw/czkO4+QvCqw$rF1gUTisBVdQJsFlJWNeQNRKIYqEi9X6Sj3pON7FudY');
